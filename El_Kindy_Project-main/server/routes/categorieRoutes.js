import express from "express";
import { verifyToken, verifyRoles } from "../middleware/auth.js";
import { createCategorie, getAllCategories, updateCategorie, deleteCategorie, getCategorieById } from "../controllers/categorieController.js";

const router = express.Router();

//router.get("/",verifyToken, getAllCategories);
router.get("/allCategories", getAllCategories);
router.get("/",verifyToken, getAllCategories);
router.put("/:id",verifyToken, updateCategorie);
router.delete("/:id",verifyToken, deleteCategorie);
router.get("/:id",verifyToken, getCategorieById);
router.get("/categorie/:id", getCategorieById);

export default router;
