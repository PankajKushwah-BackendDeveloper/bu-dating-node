import express from 'express'
import { requireSignIn } from '../middleware/authMiddleware.js';
import { addInterest, getInterests } from '../controller/interestController.js';

const router = express.Router();

router.post('/add-new',addInterest);
router.get('/',getInterests);

export default router;