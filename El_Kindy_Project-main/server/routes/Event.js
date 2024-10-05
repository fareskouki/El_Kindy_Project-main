import express from 'express';
import {  list,remove,getEventById} from '../controllers/event.js'; 

const router = express.Router();


router.get("/events", list);
//router.put("/:id", updateEvent);
router.delete("/events/:id",remove);
router.get("/events/:id", getEventById);


export default router;