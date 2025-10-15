import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profileImage : {
        type : String,
        required : true,
        trim : true
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    }
},{timestamp : true});

const user = mongoose.model("users",userSchema);

export default user;