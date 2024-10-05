import express from "express";
import { addNewPlanning , getAllPlannings , getPlanningsForTeacher , getPlanningsForStudent , updatePlanning ,  deletePlanning , getPlanning ,getPlanningDetails} from "../controllers/planningController.js";

const router = express.Router();

// Route pour ajouter un nouvel événement
router.post("/add", addNewPlanning);
router.get("/all" , getAllPlannings);
router.get("/teacher/:teacherId", getPlanningsForTeacher);

router.get("/student/:studentId", getPlanningsForStudent);
router.get("/:id/details", getPlanningDetails);

router.delete("/:id", deletePlanning);
router.get("/:id", getPlanning);
router.put("/:id", updatePlanning);

export default router;