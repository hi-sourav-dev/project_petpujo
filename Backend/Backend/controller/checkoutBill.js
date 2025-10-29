import express from "express";
const router = express.Router();
import Unclaimed from "../models/unclaimedModel.js";
import Claimed from "../models/claimedModel.js";

// Claim one item using its _id
router.post("/unclaimed/checkout/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const order = await Unclaimed.findById(id);
    console.log(order);
    if (!order) return res.status(404).json({ error: "Order not found" });

    console.log(order);
    await Claimed.create(order.toObject());
    await Unclaimed.deleteOne({ _id: id });

    res.json({ message: "Order claimed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;