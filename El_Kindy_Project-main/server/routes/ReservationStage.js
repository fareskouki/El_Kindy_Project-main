import express from 'express';
import { createReservation, listReservationsByid,listReservations,updateReservationStatus  } from '../controllers/ReservationStageController.js';


const router = express.Router();

router.post("/:stageId/reservation", createReservation);
router.get("/reservation/:stageId", listReservationsByid);
router.get("/reservations", listReservations);
router.put('/updateReservationStatus/:reservationstageId', updateReservationStatus);

export default router;