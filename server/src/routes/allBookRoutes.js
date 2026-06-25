import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";
import { getAllBooksList } from "../controllers/bookController.js";

const router = express.Router()

router.get('/getallbooks', auth , getAllBooksList );

export default router;
