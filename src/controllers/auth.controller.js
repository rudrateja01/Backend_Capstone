import bcrypt  from "bcryptjs";
import user from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { uploadImage } from "../utils/cloudinary.js";
import dotenv from "dotenv";
dotenv.config();


export const signup = async(req,res)=>{
    try {   
        const {fullName,email,password}=req.body;
        console.log(req.body);
        
        const profilePicture = req.file;
        
        if(!fullName || !email || !password || !profilePicture ){
            return res.status(400).json({success:false,message:"Fields are Missing"})
        }

        // user may already exist
        const existingEmail = await user.findOne({email});
        if(existingEmail){
           return res.status(400).json({success:false,message:"email already exist"})
        }

         // hash password
        const hashedPass = await bcrypt.hash(password,10);

         // upload image to cloudinary
        // console.log(req.file)
        const profileImage = await uploadImage(req.file.buffer);
        console.log(profileImage);

        const newUser = new user({fullName,email,password : hashedPass,profileImage : profileImage.secure_url});
        await newUser.save();

        res.status(201).json({success : true,message : "User Created Successfully", user : newUser})
    } catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
        console.log(error.message);
    }
}

// import jwt from "jsonwebtoken"
export const login = async(req,res)=>{
    try {
        console.log(req.body);
        const {email,password} = req.body;
        
        
        if(!email || !password){
            return res.status(400).json({success:false,message:"fields are missing"})
        }
        const findUser = await user.findOne({email});
        console.log(findUser);
        
        if(!findUser){
            return res.status(400).json({success:false,message:"Email Not Found"})
        }
        const isMatch = await bcrypt.compare(password,findUser.password);
        if(!isMatch){
            return res.status(404).json({success:false,message:"password Not Found"})
        }
        const token = jwt.sign({_id:findUser.id,email: findUser.email, role: findUser.role},process.env.JWT_SECRET,{expiresIn:"1h"})
        console.log(token);
    
        res.status(200).json({success:true,message:"user login successfully",token, user : {id:findUser._id,email:findUser.email}})
    }catch(error){
        res.status(500).json({success:false, message:"Internal Server Error"})
        console.log(error.message);
    }
}
// update your profile as well
export const userUpdate = async(req,res)=>{
    try {
        const {_id}= req.user;
        const {fullName,password} = req.body;

        if(!fullName,!password){
            res.status(400).json({success: false ,message:"fields are missing"})
        }
        const hashedPass = await bcrypt.hash(password,10);

        await user.updateOne({_id},{fullName,password : hashedPass});
        res.status(200).json({success : true, message : "user updated successfully"})

    } catch (error) {
        res.status(500).json({success:false,message : "Internal Server Error"})
    }
}

// delete the user
export const userDelete = async(req,res)=>{
    try {
        const {_id} = req.user;

        if(!_id){
            return res.status(404).json({success:false,message:"user not found"})
        }

        // Find user by email
        const existingUser = await user.findOne({_id});
        if(!existingUser){
           return res.status(400).json({success:false,message:"user does not exist"})
        }

        // // delete all memories of the user
        // await Memory.deleteMany({existingUser : existingUser._id})

        // delete the user as well
        // await user.findByIdAndDelete(existingUser._id)
        await user.deleteOne({_id});

        res.status(200).json({success : true,message : "User deleted Successfully"})
    } catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
        console.log(error.message);
    }
}

//get single user
export const getSingleUser = async (req,res)=>{
    try {
        const {_id} = req.user;
        const findUser = await user.findById(_id);
        if(!findUser){
            res.status(400).json({success : false, message : "user not found"})
        }
        res.status(200).json({success : true, findUser})
    } catch (error) {
        res.status(500).json({success : false,message : "Internal server error"});
        console.log(error.message);
    }
}