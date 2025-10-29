import mongoose from "mongoose";

// Define the schema for staff signup
const staffSchema = new mongoose.Schema({
  username: String,
  userId: String,
  email: String,
  password: String,
  mobileNumber: String,
  profilePicture: String, // Store file path or URL
  agreedToTerms: Boolean,
  validStaff:Boolean,
});

// Use the "EasyPetpuja" database from the existing connection
const db = mongoose.connection.useDb("EasyPetpuja");

// Create the model on that database with the collection name "StaffRequest"
// (Note: Mongoose will pluralize it to "staffrequests" unless you specify a collection option.)
const StaffRequest = db.model("StaffRequest", staffSchema ,"StaffRequest");

// Function to insert staff data
export async function insertStaff(data) {
  const staff = new StaffRequest(data);
  return await staff.save();
}

export default StaffRequest;