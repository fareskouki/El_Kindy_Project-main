import express from "express";
import { getAllShops, updateShop, deleteShop, getShopById,rejectShop,approveShop ,deleteLikedShops,getAllLikedShops} from "../controllers/ShopController.js";

const router = express.Router();

router.get("/", getAllShops);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);
router.get("/:id", getShopById);
router.patch('/:id/approve', approveShop);
router.delete('/liked/all', deleteLikedShops);
router.get('/liked/all', getAllLikedShops);

// Route for rejecting inscription
router.patch('/:id/reject', rejectShop);
export default router;
