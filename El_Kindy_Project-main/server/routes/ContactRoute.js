import express from 'express';
import { create,list,update,remove,getContactById} from "../controllers/ContactUsController.js";

const router = express.Router();

router.post("/",create);
router.get("/",list);
router.put("/:id",update);
router.delete("/:id",remove);
router.get("/:id",getContactById);

export default router;
