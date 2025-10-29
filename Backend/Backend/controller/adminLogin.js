import express  from "express";

const router = express.Router();

router.get("/adminLogin",(req,res)=>{
    res.render("petpuja/logins/index",{formContent:"../component/adminForm"});
});  

export default router;