import express  from "express";

const router = express.Router();

router.get("/adminSignup",(req,res)=>{
    res.render("petpuja/logins/index",{formContent:"../component/adminSignup"});
});  

export default router;