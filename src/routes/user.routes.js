import { Router } from "express";
import { signup,login,userDelete,userUpdate, getSingleUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middlewear.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup",upload.single("profileImage"),signup);// jwt not issued here
router.post("/login",login);  // jwt issued here

// WE WILL AUTHENTICATE THE USER BECAUSE JWT HAS ALREADY BEEN ISSUED
router.get("/", authenticate, getSingleUser);
router.patch("/",authenticate, upload.single("profileImage"),userUpdate);
router.delete("/",authenticate,userDelete);

export default router;
