import express from 'express';
import { create, list,update,remove,getClasseById} from '../controllers/salleController.js'; 

const router = express.Router();

router.post("/",create);
router.get("/",list);
router.put("/:id",update);
router.delete("/:id",remove);
router.get("/:id",getClasseById);

export default router;
