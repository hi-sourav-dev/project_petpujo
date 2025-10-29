//importing required modules....
import express from "express";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
// import Razorpay from "razorpay";

//configiring the dotenv module...
dotenv.config();

//importing the controlers(routers) from seperate modules...
import home  from "./controller/home.js";
import about  from "./controller/about.js";
import staffLogin  from "./controller/staffLogin.js";
import adminLogin  from "./controller/adminLogin.js";
import signUp from "./controller/signUp.js";
import adminSignup from "./controller/adminSignup.js";
import StaffPortal from "./controller/StaffPortal.js";
import staffSignup from "./controller/staffSignup.js";
import adminPortal from "./controller/adminPortal.js";
import getAdminSignupData from "./controller/getAdminSignupData.js";
import findBill from "./controller/findBill.js";
import checkoutBill from "./controller/checkoutBill.js";
import unclaimedByDate from "./controller/unclaimedByDate.js";
import claimedByDate from "./controller/claimedByDate.js";
import showAllStaffs from "./controller/showAllStaffs.js";
import showAllAdmins from "./controller/showAllAdmins.js";
import staffRequests from "./controller/staffRequests.js";
import adminRequests from "./controller/adminRequests.js";
import hireMember from "./controller/hireMember.js";
import fireMember from "./controller/fireMember.js";
import rejectMember from "./controller/rejectMember.js";
import messages from "./controller/messages.js";
import countRequests from "./controller/countRequests.js";
import markAsRead from "./controller/markAsRead.js";
import sendReply from "./controller/sendReply.js";


// establishing the connection with mongodb...
await mongoose.connect(process.env.MONGO_CONN_STR);
// console.log("db connection successfull...");

//initializing the express module...
const app = express();

//initializing the current directory as ES module...
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

//using middelewares...
// app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

//using route handlers....
app.use("/",home);
app.use("/",about);
app.use("/",staffLogin);
app.use("/",adminLogin);
app.use("/",signUp);
app.use("/",adminSignup);
app.use("/",StaffPortal);
app.use("/",staffSignup);
app.use("/",adminPortal);
app.use("/",getAdminSignupData);
app.use("/",findBill);
app.use("/",checkoutBill);
app.use("/",unclaimedByDate);
app.use("/",claimedByDate);
app.use("/",showAllStaffs);
app.use("/",showAllAdmins);
app.use("/",staffRequests);
app.use("/",adminRequests);
app.use("/",hireMember);
app.use("/",fireMember); 
app.use("/",rejectMember);
app.use("/",messages);
app.use("/",countRequests);
app.use("/",markAsRead);
app.use("/",sendReply);

//sending by default page...
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"petpuja","getStarted","index.html"));
});  

// POST: Cancel Razorpay payment
// app.post("/unclaimed/cancel/:paymentId", async (req, res) => {
  
//   const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
//   });

//   try {
//     const paymentId = req.params.paymentId;
//     const refund = await instance.payments.refund(paymentId);

//     res.json({ message: "Order canceled. Refund will be processed." });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


//making server listening or running on port 3000
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
});

