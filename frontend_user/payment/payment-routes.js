// payment-routes.js - Handles all payment-related API endpoints
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto'); // i used for generating and verifying secure HMAC signatures.
const router = express.Router();
const mongoose = require('mongoose');
const razorpayConfig = require('./config');

mongoose.connect('mongodb://127.0.0.1:27017/EasyPetpuja')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Mongo error:', err));
const paymentSchema = new mongoose.Schema({

  billNumber: String,

  orderId: String,

  paymentId: String,

  amount: Number,        // store the amount in your preferred unit (e.g. original currency units)

  currency: String,

  userId: String,

  items: Array,

  createdAt: {

    type: Date,

    default: Date.now

  }

});

const Payment = mongoose.model('Payment', paymentSchema, 'Payments');

// Model for "Unclaimed" collection using same schema

const Unclaimed = mongoose.model('Unclaimed', paymentSchema, 'Unclaimed');

// Initialize Razorpay with  keys
const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret
});

// Creating a new order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes, userId } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Amount in paise (Razorpay requires amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        ...notes,
        userId: userId || 'guest'
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});


// Verify payment signature
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    const signatureString = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", razorpayConfig.key_secret)
      .update(signatureString)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      //  PLACE THIS BLOCK HERE
      const billNumber = generateSecureCode();

      const paymentData = {
        billNumber,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        userId: orderDetails.userId,
        items: orderDetails.items // includes name, quantity, price
      };

      //  Save to MongoDB
      await Payment.create(paymentData);
      await Unclaimed.create(paymentData);

      res.json({
        success: true,
        message: "Payment verification successful",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature."
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message
    });
  }
});


// Geting payment details by payment ID
router.get('/payment-details/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
});

// Check order status
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await razorpay.orders.fetch(orderId);
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
});

//  GET local payment data from MongoDB by paymentId
router.get('/local-payment/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ paymentId: req.params.paymentId });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error fetching payment from DB:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;

function generateSecureCode() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';

  // Generate 3 random lowercase letters
  let lettersPart = '';
  for (let i = 0; i < 3; i++) {
    const index = crypto.randomInt(0, letters.length);
    lettersPart += letters[index];
  }

  // Generate 3 random digits
  let digitsPart = '';
  for (let i = 0; i < 3; i++) {
    const index = crypto.randomInt(0, digits.length);
    digitsPart += digits[index];
  }

  return lettersPart + digitsPart;
}
