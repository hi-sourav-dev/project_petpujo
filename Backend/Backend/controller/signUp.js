import express  from "express";

const router = express.Router();

router.get("/signUp",(req,res)=>{
    res.render("petpuja/logins/index",{formContent:"../component/signUpForm"});
});  

export default router;