import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { addFollwer, addTags, deleteTag, getAllTags, updateTag } from '../controller/tagsController.js';

const router = express.Router();

router.post('/add-tag',requireSignIn,isAdmin,addTags);
router.get('/get-all',getAllTags);
router.post('/add-follower',requireSignIn,addFollwer);
router.put('/update/:tagId',requireSignIn,isAdmin,updateTag);
router.delete('/delete/:tagId',requireSignIn,isAdmin,deleteTag);
export default router;