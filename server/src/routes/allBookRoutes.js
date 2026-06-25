import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";
import { getAllBooksList, AddNewBook, EditNeweBookData, DeleteBook} from "../controllers/bookController.js";

const router = express.Router()

router.get('/getallbooks', auth , getAllBooksList );
router.post("/addnewbook", auth, upload.single("image"), AddNewBook);
router.post("/editnewebook", auth, upload.single("image"), EditNeweBookData);
router.post("/deletebook/:id", auth, DeleteBook); 

export default router;
