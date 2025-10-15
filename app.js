import express from "express";

import dotenv from "dotenv" 
dotenv.config(); // for loading .env files

// initialise app and connect db
const app = express();
import { connectDB } from "./src/configs/db.js";
connectDB();
import authRoutes from "./src/routes/user.routes.js"

//Global middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use("/api/v1/users",authRoutes)

app.listen(3000,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})


