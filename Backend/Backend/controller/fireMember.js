import express from "express";
const router = express.Router();

import petpujaLogins from "../models/petpujaLogins.js";

// Fire member
router.post("/fireMember", async (req, res) => {
  const { _id, email, mobileNumber } = req.body;

  try {
    // Normalize input

    const query = { _id, email, mobileNumber };

    let result = await petpujaLogins.findOne(query);

    if (!result) {
      return res.status(404).json({ message: `not found` });
    }

    // Optional: you can also check for validStaff or validAdmin flags here
    await petpujaLogins.deleteOne(query);

    res.json({ message: `Fired successfully!`,id:_id});

  } catch (err) {
    console.error("Error firing member:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
