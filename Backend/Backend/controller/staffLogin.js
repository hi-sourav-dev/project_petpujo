import express  from "express";

const router = express.Router();

router.get("/staffLogin",(req,res)=>{
    res.render("petpuja/logins/index",{formContent:"../component/staffForm"});
});  

export default router;