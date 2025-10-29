import { error } from "node:console";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

//initializing the current directory as ES module...
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


async function findStaff(email,password,res,client) {
   try {
   
      await client.connect();
      const database = client.db("EasyPetpuja"); // Your database name
      const collection = database.collection("PetpujaLogins"); // Your collection name
      
      const user = await collection.findOne({ email: email , password:password});
      if(user)
      {
         console.log("User found:", user);
         res.render(path.join(dirname(__dirname),"views","petpuja","staffHomePage","index.ejs"),{profilePicture:user.profilePicture.replace(/\\/g,'/'),username:user.username,empId:user._id});
      } 
      else 
      {
         console.log("User not found");
         res.status(404).render(path.join(dirname(__dirname),"public","codeTemplates","401"),{returnUrl:"staffLogin"});
      }
   }catch(error) 
   {
      console.error("Error:", error);
   } 
   finally 
   {
      await client.close();
   }
}
export default findStaff;
