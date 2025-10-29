async function findAdmin(userName,userId,email,password,mobileNumber,client) {
    try {
       await client.connect();
       const database = client.db("EasyPetpuja"); // Your database name
       const collection = database.collection("PetpujaLogins"); // Your collection name
       
       const user = await collection.findOne({username:userName,userId:userId, email: email , password:password, mobileNumber:mobileNumber});
      //  const user = await collection.findOne({username:'admin',userId:'admin', email: 'admin@gmail.com' , password:'224', mobileNumber:'999'});
       if (user) {
             console.log("User found:", user);
             return user;
            //  res.send("admin home page");
          } else {
             console.log("User not found");
            //  res.send("no");

          }
       } catch (error) {
          console.error("Error:", error);
       } finally {
          await client.close();
         }
     
    }
 
    export default findAdmin;
    