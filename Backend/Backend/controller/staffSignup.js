import express from "express";
import multer from "multer";
import { insertStaff } from "../models/staffModel.js";

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

// Handle staff signup with upload middleware
router.post("/getStaffSignupData", upload.single("profilePicture"), async (req, res) => {
  try {
    // The keys now match your schema
    const {
      username,      
      userId,
      email,
      password,
      mobileNumber,
      agreedToTerms,
    } = req.body;

    console.log(username, userId, email, password, mobileNumber, agreedToTerms);

    // Get the profile picture path if available
    const profilePicture = req.file ? req.file.path : "";

    // Insert data using matching field names
    const result = await insertStaff({
      username,
      userId,
      email,
      password,
      mobileNumber,
      profilePicture,
      agreedToTerms: agreedToTerms === "true",
      validStaff:false,
    });

    res.status(202).sendFile(path.join(dirname(__dirname),"public","codeTemplates","202.html"));
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

export default router;