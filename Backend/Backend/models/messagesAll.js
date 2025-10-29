import mongoose from "mongoose";

// Define the schema for admin signup
const messages = new mongoose.Schema({
  username: String,
  userId: String,
  email: String,
  password: String,
  mobileNumber: Number,
  profilePicture:String,
  validStaff: Boolean,
  validAdmin: Boolean,
  data:String,
  markASRead:Boolean},
  {
    timestamps:true
  });

// Use the "EasyPetpuja" database from the existing Mongoose connection
const db = mongoose.connection.useDb("EasyPetpuja");

const Messages = db.model("Messages", messages, "Messages");


export default Messages;