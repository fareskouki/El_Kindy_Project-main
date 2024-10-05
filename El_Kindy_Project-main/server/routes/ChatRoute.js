import express from 'express'
import { createChat, findChat, userChats ,getChats } from '../controllers/ChatController.js';
import { verifyToken } from "../middleware/auth.js";
const router = express.Router()

router.post('/', verifyToken,createChat);
router.get('/:userId', verifyToken, userChats);
router.get('/find/:firstId/:secondId', verifyToken, findChat);
router.get('/getChats/:userId',verifyToken, getChats);
export default router