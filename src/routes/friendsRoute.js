import express from 'express';
import {  requireSignIn } from "../middleware/authMiddleware.js";
import { sendFriendRequest, exploreFriends, getFriendList, getFriendSuggestion, getFriendRequests, acceptFriendRequest } from '../controller/friendsController.js';

const router = express.Router();

router.post('/add',requireSignIn,sendFriendRequest);
router.get('/get-friend-requesets',requireSignIn,getFriendRequests);
router.post('/accept-request',requireSignIn,acceptFriendRequest);
router.get('/get-list',requireSignIn,getFriendList);
router.get('/friend-suggestion',requireSignIn,getFriendSuggestion);
router.get('/explore',requireSignIn,exploreFriends);
export default router;