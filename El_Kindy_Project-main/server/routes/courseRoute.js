import express from "express";
import { getAll, removeCourse, getCourseById, getAllCoursesGroupedByCategory } from "../controllers/courseController.js";
import { verifyToken, verifyRoles } from "../middleware/auth.js";

const router = express.Router();

//router.get("/all", verifyToken, verifyRoles(["superAdmin", "admin", "teacher"]), getAll);
router.get("/allCourses", getAll);
router.get("/all", getAll);
router.get("/getAllByCategories", getAllCoursesGroupedByCategory)
router.delete("/delete/:id",verifyToken, removeCourse);
router.get("/:id",verifyToken, getCourseById);
router.get("/findCourseById/:id", getCourseById);

export default router;