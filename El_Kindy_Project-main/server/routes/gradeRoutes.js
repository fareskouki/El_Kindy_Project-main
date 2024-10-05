import express from "express";
import {affectGrade,getGrades,getGradesByCourseAndClass,getGradeByStudentId,getGradesByStudentAndCourse,getGradeById,affectGradeWithoutClass} from "../controllers/grade.js";

const router = express.Router();
//route for affectGrade
router.post("/affectGrade", affectGrade);
//route for getGrades
router.get("/getGrades", getGrades);
//route for getGradesByCourseAndClass
router.get("/getGradesByCourseAndClass/:courseId/:classId", getGradesByCourseAndClass);
//route for getGradesByStudentAndCourse
router.get("/getGradesByStudentAndCourse/:studentId/:courseId", getGradesByStudentAndCourse);
//route for getGradeById
router.get("/getGradeById/:id", getGradeById);
//route for affectGradeWithoutClass
router.post("/affectGradeWithoutClass", affectGradeWithoutClass);
//route for getGradeByStudentId
router.get("/getGradeByStudentId/:studentId", getGradeByStudentId);

export default router;