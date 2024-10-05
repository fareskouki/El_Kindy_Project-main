import express from 'express';
import { Add, Verify,AddStage,VerifyStage} from '../controllers/paymentController.js';
const router = express.Router();

router.post("/payment", Add);
router.post("/payment/:id", Verify);
router.post("/paymentStage", AddStage);
router.post("/paymentStage/:id", VerifyStage); 

/* router.post("/payment/reservation", AddReservation); */

export default router
