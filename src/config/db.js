const dns=require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);

const mongoose =require("mongoose");
require("dotenv").config();

const connectDB=async()=>{
    const connection =await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connection Established`)

}
module.exports=connectDB;