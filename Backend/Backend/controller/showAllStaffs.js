import express  from "express";
const router = express.Router();
import  PetpujaLogins  from "../models/petpujaLogins.js";

router.get('/employeeDetails/staffs', async (req, res) => {
    try {
      const staffs = await PetpujaLogins.find({validStaff:true});
      res.json(staffs);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching staffs' });
    }
  });
  
export default router;