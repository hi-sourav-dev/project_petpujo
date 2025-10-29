import express from "express";
const router = express.Router();

import petpujaLogins from "../models/petpujaLogins.js";
import StaffRequest from "../models/staffModel.js";
import AdminRequest from "../models/adminModel.js";

// Hire member
router.post("/hireMember/:staffType", async (req, res) => {
  let { staffType } = req.params;
  const { _id, email, mobileNumber } = req.body;

  try {
    let data;

    // Normalize input
    staffType = staffType.trim();

    if (staffType === "Staff Request") {
      data = await StaffRequest.findOne({ _id, email, mobileNumber });
      if (!data) {
        return res.status(404).json({ message: "Staff not found" });
      }

      const newStaff = { ...data.toObject(), validStaff: true };
      await petpujaLogins.create(newStaff);
      await StaffRequest.deleteOne({ _id, email, mobileNumber });

    } else if (staffType === "Admin Request") {
      data = await AdminRequest.findOne({_id, email, mobileNumber });
      console.log(data);
      if (!data) {
        return res.status(404).json({ message: "Admin not found" });
      }

      const newAdmin = { ...data.toObject(), validAdmin: true };
      await petpujaLogins.create(newAdmin);
      await AdminRequest.deleteOne({ _id,email, mobileNumber });

    } else {
      return res.status(400).json({ message: "Invalid staff type" });
    }

    res.json({ message: `${staffType.replace(" Request", "")} hired successfully!`});
  } catch (err) {
    console.error("Error hiring member:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
