import express  from "express";
const router = express.Router();

router.get("/home",(req,res)=>{
    res.send("this is home page..");
});  

export default router;