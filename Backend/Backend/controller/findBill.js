import express from "express";
const router = express.Router();
import Unclaimed from "../models/unclaimedModel.js";

// Get all orders with same billNo
router.get("/unclaimed/:billNo", async (req, res) => {
  try {
    const billNumber = req.params.billNo;
    const data = await Unclaimed.find({ billNumber:parseInt(billNumber) });
    if (!data.length) return res.status(404).json({ message: "No records found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;