import express from "express";
const router = express.Router();
import Messages from "../models/messagesAll.js";

// Get all staff employee requests
router.get("/messages", async (req, res) => {
  try {
    const data = await Messages.find({markASRead:false}).sort({createdAt:-1});
    console.log(55,data);
    if (!data.length) return res.status(404).json({ message: "No records found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;