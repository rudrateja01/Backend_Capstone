import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try{
        console.log(process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("database connected");
    }
    catch{
        console.log("MongoDB connection failed");
        process.exit(1);       
    }
}