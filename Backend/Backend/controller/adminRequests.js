import express from "express";
const router = express.Router();
import AdminRequest from "../models/adminModel.js";

// Get all staff employee requests
router.get("/employeeRequests/admin", async (req, res) => {
  try {
    const data = await AdminRequest.find();
    console.log(data);
    if (!data.length) return res.status(404).json({ message: "No records found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;