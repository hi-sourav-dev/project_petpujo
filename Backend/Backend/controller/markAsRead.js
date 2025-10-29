import express from "express";
const router = express.Router();
import Messages from "../models/messagesAll.js";

// Mark a message as read
router.patch("/mark-as-read/:id", async (req, res) => {
  try {
    const updated = await Messages.findByIdAndUpdate(
      req.params.id,
      { markASRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Marked as read", data: updated });
  } catch (error) {
    console.error("Error marking as read:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
