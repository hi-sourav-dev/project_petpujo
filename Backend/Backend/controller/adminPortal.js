import express  from "express";
import { MongoClient } from "mongodb";
import findAdmin from "../models/findAdminLogin.js";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

//initializing the current directory as ES module...
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const uri = "mongodb://localhost:27017/ProjectOne";
const client = new MongoClient(uri);

const router = express.Router();

router.post("/adminPortal",async (req,res)=>{

   const {Username,userId,password,mobileNumber,email,checkbox} = req.body;
   console.log(Username,userId,password,mobileNumber,email,checkbox);

   try{
      const user = await findAdmin(Username,userId,email,password,parseInt(mobileNumber),client);
      
      if(user)
      {
         console.log(user)
         res.render(path.join(dirname(__dirname),"views","petpuja","adminPortal","index"),{username:user.username,profilePicture:user.profilePicture.replace(/\\/g,'/')});
      }
      else
      {
         res.status(404).render(path.join(dirname(__dirname),"public","codeTemplates","401"),{returnUrl:"adminLogin"});
      }
   }
   catch(error)
   {
      console.log("error while find admin...");
      res.status(500).send("server error");
   }

});  

export default router;
