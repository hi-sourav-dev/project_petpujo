// routes/stats.js
import express from 'express';
import StaffRequest from '../models/staffModel.js';
import AdminRequest from '../models/adminModel.js';
import Messages from "../models/messagesAll.js";

const router = express.Router();

router.get('/loadRequestsStats', async (req, res) => {
  try {
    const [staffCount, adminCount , messageCount] = await Promise.all([
      StaffRequest.countDocuments(),
      AdminRequest.countDocuments(),
      Messages.countDocuments({markASRead:false})
    ]);

    res.json({ staffRequests: staffCount, adminRequests: adminCount , messageCount:messageCount });
  } catch (err) {
    console.error("Error loading request stats:", err);
    res.status(500).json({ error: 'Failed to fetch request stats' });
  }
});

export default router;
