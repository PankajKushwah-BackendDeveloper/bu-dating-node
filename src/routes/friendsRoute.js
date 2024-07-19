import express from 'express';
import {  requireSignIn } from "../middleware/authMiddleware.js";
import { addFriends, exploreFriends, getFriendList, getFriendSuggestion } from '../controller/friendsController.js';

const router = express.Router();

router.post('/add',requireSignIn,addFriends);
router.get('/get-list',requireSignIn,getFriendList);
router.get('/friend-suggestion',requireSignIn,getFriendSuggestion);
router.get('/explore',requireSignIn,exploreFriends);
export default router;