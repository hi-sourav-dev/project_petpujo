import express  from "express";
const router = express.Router();
import  PetpujaLogins  from "../models/petpujaLogins.js";

router.get('/employeeDetails/admins', async (req, res) => {
    try {
      const admins = await PetpujaLogins.find({validAdmin:true});
      res.json(admins);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching admins' });
    }
  });
  
export default router;