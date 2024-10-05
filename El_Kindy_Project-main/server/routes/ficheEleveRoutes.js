import express from "express";
import { affectFicheEleve ,getFicheEleves,getFicheElevesByStudent,getFicheElevesByClassAndCourse,deleteFicheEleve ,getFicheEleveByStudentAndCourse} from "../controllers/FicheEleveController.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

//route for affectFicheEleve
router.post("/affectFicheEleve", affectFicheEleve);
//route for getFicheEleves
router.get("/getFicheEleves", getFicheEleves);
//route for getFicheElevesByStudent
router.get('/getFicheElevesByStudent/:studentId', getFicheElevesByStudent);
//route for getFicheElevesByClassAndCourse
router.get('/getFicheElevesByClassAndCourse/:classId/:courseId', getFicheElevesByClassAndCourse);
//route for deleteFicheEleve
router.delete('/deleteFicheEleve/:ficheEleveId', deleteFicheEleve);
//route for getFicheEleveByStudentAndCourse
router.get('/getFicheEleveByStudentAndCourse/:studentId/:courseId', getFicheEleveByStudentAndCourse);


export default router;
