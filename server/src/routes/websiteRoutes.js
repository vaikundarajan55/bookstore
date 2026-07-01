import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";
import { getShopBooksList} from "../controllers/websiteController.js";

const router = express.Router()

router.get('/getshopbooks', auth , getShopBooksList );


export default router;
