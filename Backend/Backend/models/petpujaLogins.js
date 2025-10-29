import mongoose from "mongoose";

// Define the schema for admin signup
const loginSchema = new mongoose.Schema({
  username: String,
  userId: String,
  email: String,
  password: String,
  mobileNumber: Number,
  profilePicture: String, // Stores file path or URL
  agreedToTerms: Boolean,
  validStaff: Boolean,
  validAdmin: Boolean,
});

// Use the "EasyPetpuja" database from the existing Mongoose connection
const db = mongoose.connection.useDb("EasyPetpuja");

// Create the model on the "EasyPetpuja" database.  
// The third parameter enforces the collection name to be exactly "AdminRequest" (no pluralization).
const PetpujaLogins = db.model("PetpujaLogins", loginSchema, "PetpujaLogins");


export default PetpujaLogins;