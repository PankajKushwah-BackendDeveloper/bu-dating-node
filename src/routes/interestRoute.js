import express from 'express'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { addInterest, deleteInterest, getInterests, updateInterest } from '../controller/interestController.js';

const router = express.Router();

router.post('/add-new',requireSignIn,isAdmin,addInterest);
router.get('/',getInterests);
router.delete('/delete/:interestId',requireSignIn,isAdmin,deleteInterest)
router.put('/:interestId',requireSignIn,isAdmin,updateInterest);

export default router;