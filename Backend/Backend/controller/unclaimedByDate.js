import express  from "express";
const router = express.Router();
import Unclaimed from "../models/unclaimedModel.js";

router.get("/unclaimed/date/:fromDate/:toDate", async (req, res) => {
    try {
      const  fromDate  = req.params.fromDate;
      const  toDate  = req.params.toDate;
      const start = new Date(fromDate);
      const end = new Date(toDate);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      console.log(start,end);
      const result = await Unclaimed.find({
        createdAt: { $gte:start, $lt:end}
      });
      console.log(result[0],22);
  
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


export default router;  


