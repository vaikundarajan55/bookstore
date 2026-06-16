import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { upload } from "../utils/upload.js";
import { getAllUsersList, AddNewUsers, EditNeweUserData ,DeleteUser} from "../controllers/userController.js";
const router = express.Router();

router.get("/getallusers", auth, getAllUsersList);
router.post("/addneweuser", auth, upload.single("image"), AddNewUsers);
router.post("/editneweuser", auth, upload.single("image"), EditNeweUserData);
router.post("/deleteuser/:id", auth, DeleteUser);

export default router;