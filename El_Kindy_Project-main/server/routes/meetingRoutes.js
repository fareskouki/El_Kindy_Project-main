import express from 'express';
import { addMeeting,getAllMeetings } from '../controllers/meetingController.js';

const router = express.Router();

// Route pour ajouter une nouvelle réunion
router.post('/add', addMeeting);
router.get('/getAll', getAllMeetings);


export default router;
