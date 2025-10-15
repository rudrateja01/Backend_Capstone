import jwt from "jsonwebtoken";

export const authenticate =  (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if(!authHeader || !authHeader.startsWith(`Bearer `)){
        res.status(401).json({message:"no token provided", success:false})
    };

    //Bearer !$%iuarfherohgoehrifhh84rfr55rfhrfhrek
    // [Bearer, !$%iuarfherohgoehrifhh84rfr55rfhrfhrek]
    //    0         // 1
    const token = authHeader.split(" ")[1]; 
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        next();      
    } catch (error) {
        console.log("Token verificatioon failed",error.message);
        res.status(401).json({success:false,message:"Invalid Token"})
    }
}