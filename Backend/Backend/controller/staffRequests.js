import express from "express";
const router = express.Router();
import StaffRequest from "../models/staffModel.js";

// Get all staff employee requests
router.get("/employeeRequests/staff", async (req, res) => {
  try {
    const data = await StaffRequest.find();
    console.log(data);
    if (!data.length) return res.status(404).json({ message: "No records found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;