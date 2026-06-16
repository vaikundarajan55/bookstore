import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";
import { getAllUsersList, AddNewUsers } from "../controllers/userController.js";
const router = express.Router();

router.get("/getallusers", auth, getAllUsersList);
router.post("/addneweuser", auth, upload.single("image"), AddNewUsers);

export default router;