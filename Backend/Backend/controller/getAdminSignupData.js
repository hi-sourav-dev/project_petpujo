import express from "express";
import multer from "multer";
import { insertAdmin } from "../models/adminModel.js";


import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

//initializing the current directory as ES module...
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Handle admin signup with file upload middleware
router.post("/getAdminSignupData", upload.single("profilePic"), async (req, res) => {
  try {
    // Retrieve fields from the form (note the field names from the HTML)
    const { Username, userId, email, password, mobileNo, checkbox } = req.body;
    
    // Map form keys to the model keys
    const username = Username;
    const mobileNumber = mobileNo;
    const agreedToTerms = checkbox; // Checkbox will be present if checked (often as "on")

    // Log received data for debugging
    console.log(username, userId, email, password, mobileNumber, agreedToTerms);

    // Get the uploaded file path from Multer
    const profilePicture = req.file ? req.file.path : "";

    // Insert admin data
    const result = await insertAdmin({
      username,
      userId,
      email,
      password,
      mobileNumber,
      profilePicture,
      agreedToTerms: agreedToTerms === "true" || agreedToTerms === "on",
      validStaff: false,  // Default value; adjust as needed
    });

    res.status(201).sendFile(path.join(dirname(__dirname),"public","codeTemplates","202.html"));
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

export default router;