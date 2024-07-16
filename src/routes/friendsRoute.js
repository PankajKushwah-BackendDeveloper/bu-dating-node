import express from 'express';
import {  requireSignIn } from "../middleware/authMiddleware.js";
import { addFriends, getFriendList, getFriendSuggestion } from '../controller/friendsController.js';

const router = express.Router();

router.post('/add',requireSignIn,addFriends);
router.get('/get-list',requireSignIn,getFriendList);
router.get('/friend-suggestion',requireSignIn,getFriendSuggestion);
export default router;