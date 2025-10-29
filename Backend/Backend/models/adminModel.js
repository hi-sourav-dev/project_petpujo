import mongoose from "mongoose";

// Define the schema for admin signup
const adminSchema = new mongoose.Schema({
  username: String,
  userId: String,
  email: String,
  password: String,
  mobileNumber: String,
  profilePicture: String, // Stores file path or URL
  agreedToTerms: Boolean,
  validStaff: Boolean,
});

// Use the "EasyPetpuja" database from the existing Mongoose connection
const db = mongoose.connection.useDb("EasyPetpuja");

// Create the model on the "EasyPetpuja" database.  
// The third parameter enforces the collection name to be exactly "AdminRequest" (no pluralization).
const AdminRequest = db.model("AdminRequest", adminSchema, "AdminRequest");

// Function to insert admin data
export async function insertAdmin(data) {
  const admin = new AdminRequest(data);
  return await admin.save();
}

export default AdminRequest;