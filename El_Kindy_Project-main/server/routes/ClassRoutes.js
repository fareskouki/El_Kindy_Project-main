import express from 'express';
import { createClass, getAllClasses,  updateClass, deleteClass ,getClasseById} from '../controllers/ClassController.js';

const router = express.Router();

// Route pour créer une nouvelle classe
router.post('/create', createClass);

// Route pour obtenir la liste de toutes les classes
router.get('/getAll', getAllClasses);

// Route pour mettre à jour les détails d'une classe existante
router.put('/:classId', updateClass);

// Route pour supprimer une classe
router.delete('/:classId', deleteClass);
router.get("/:classId",getClasseById);

export default router;