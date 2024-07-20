import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { addFollwer, addTags, getAllTags } from '../controller/tagsController.js';

const router = express.Router();

router.post('/add-tag',requireSignIn,isAdmin,addTags);
router.get('/get-all',getAllTags);
router.post('/add-follower',requireSignIn,addFollwer);
export default router;