import express from "express";
const router = express.Router();

import StaffRequest from "../models/staffModel.js";
import AdminRequest from "../models/adminModel.js";

// Reject member
router.post("/rejectMember/:staffType", async (req, res) => {
  let { staffType } = req.params;
  const { _id, email, mobileNumber } = req.body;

  try {
    // Normalize input
    staffType = staffType.trim();

    let query = { _id, email, mobileNumber };
    let deleted;

    if (staffType === "Staff Request") {
      deleted = await StaffRequest.deleteOne(query);
    } else if (staffType === "Admin Request") {
      deleted = await AdminRequest.deleteOne(query);
    } else {
      return res.status(400).json({ message: "Invalid staff type" });
    }

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: `${staffType.replace(" Request", "")} not found or already processed` });
    }

    res.json({ message: `${staffType.replace(" Request", "")} rejected successfully!` });

  } catch (err) {
    console.error("Error rejecting member:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
