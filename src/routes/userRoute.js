import express from "express";
import {  requireSignIn } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getProfileImage,
  getUser,
  userLogin,
  userSignUp,
  verifyOTP,
} from "../controller/userController.js";
import multer from "multer";
import generateStorage from "../helper/multerStorage.js";
const router = express.Router();

const storage = generateStorage('public/userProfile')
const upload = multer({storage})



router.post("/auth/sign-up",upload.single('image'),  userSignUp);
router.post("/auth/login", userLogin);
router.post('/auth/verify-otp',verifyOTP)
router.get("/", requireSignIn, getUser);
router.get('/get-image/:fileName',getProfileImage)
router.get('/all',requireSignIn,getAllUsers)


export default router;
