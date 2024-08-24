import express from 'express'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { addFun, addLifeStyle, addMusic, addSports, getFun, getInterestImage, getInterests, getLifeStyle, getMusic, getSports } from '../controller/interestController.js';
import generateStorage from '../helper/multerStorage.js'
import multer from 'multer';


const router = express.Router();

const destination = "public/interest";

const storage = generateStorage(destination);

const upload = multer({ storage });

router.post('/add-fun',requireSignIn,isAdmin,upload.single('image'),addFun);
router.post('/add-music',requireSignIn,isAdmin,upload.single('image'),addMusic);
router.post('/add-sport',requireSignIn,isAdmin,upload.single('image'),addSports);
router.post('/add-lifeStyle',requireSignIn,isAdmin,upload.single('image'),addLifeStyle);

router.get('/get-fun',getFun);
router.get('/get-music',getMusic);
router.get('/get-sports',getSports);
router.get('/get-lifeStyle',getLifeStyle);
router.get('/get-image/:fileName',getInterestImage);
router.get('/',getInterests)
export default router;