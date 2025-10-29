import mongoose from "mongoose";
  
const unclaimedSchema = new mongoose.Schema({
    billNo: Number,
    orderId: String,
    paymentId: String,
    amount: Number,
    currency: String,
    userId: String,
    items:{},
    createdAt: Date
});

const db = mongoose.connection.useDb("EasyPetpuja");
const Unclaimed = db.model("Unclaimed", unclaimedSchema, "Unclaimed");

export default Unclaimed;