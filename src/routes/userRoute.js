import express from "express";
import {  isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getProfileImage,
  getUser,
  getUserById,
  updateUserDetails,
  userLogin,
  userSignUp,
  verifyOTP,
} from "../controller/userController.js";
import multer from "multer";
import generateStorage from "../helper/multerStorage.js";
const router = express.Router();

const storage = generateStorage('public/userProfile')
const upload = multer({storage})



router.post("/auth/sign-up",upload.single('profileimage'),  userSignUp);
router.post("/auth/login", userLogin);
router.post('/auth/verify-otp',verifyOTP)
router.get('/get-image/:fileName',getProfileImage)
router.get('/all',requireSignIn,getAllUsers)
router.put('/update-profile/:userId',upload.single('profileimage'), updateUserDetails);
router.delete('/delete-profile/:userId',requireSignIn,deleteUser)
router.get('/getby-id/:userId',getUserById);

router.get("/", requireSignIn, getUser);

export default router;
