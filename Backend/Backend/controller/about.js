import express  from "express";
const router = express.Router();

router.get("/about",(req,res)=>{
    res.send("this is about page..");
});  

export default router;