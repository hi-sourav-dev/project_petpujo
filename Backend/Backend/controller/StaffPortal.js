import express  from "express";
import { MongoClient } from "mongodb";
import findStaff from "../models/findStaffLogin.js";

const uri = "mongodb://localhost:27017"; 
const client = new MongoClient(uri);

// Call the function with a username
const router = express.Router();

router.post("/StaffPortal",(req,res)=>{
   //retreive data from form as json...
   const {email,password,checkbox} = req.body;
   console.log(email,password,checkbox);
   findStaff(email,password,res,client);

});  

export default router;
