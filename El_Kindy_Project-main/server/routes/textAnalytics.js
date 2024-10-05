import express from "express";
import { textAnalytics,getBestInstructorForMonth,professors } from '../controllers/textAnalyticsClient.js';
const router = express.Router();


router.post("/analyze-sentiment", textAnalytics);
router.get("/best-instructor/:month", getBestInstructorForMonth);
router.get("/professors",professors)



export default router;