
import express from "express";
import {
  adminLogin,
  adminSignUp,
  getAdmin,
} from "../controller/adminController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/sign-up", adminSignUp);
router.post("/login", adminLogin);
router.get("/", requireSignIn, getAdmin);


export default router;



