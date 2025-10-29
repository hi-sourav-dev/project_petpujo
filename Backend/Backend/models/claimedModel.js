import mongoose from "mongoose";
  
const claimedSchema = new mongoose.Schema({
    billNumber: Number,
    orderId: String,
    paymentId: String,
    amount: Number,
    currency: String,
    userId: String,
    items:{},
    createdAt: Date,
    checkOutedAt: {
        type:Date,
        default:Date.now()
    }
});

const db = mongoose.connection.useDb("EasyPetpuja");
const Claimed = db.model("Claimed", claimedSchema, "Claimed");

export default Claimed;