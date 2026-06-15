import { getAllUsersData } from "../services/userService.js";
import md5 from "md5";

export const getAllUsersList = async (req, res) => {
    try {
        const users = await getAllUsersData();

        return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            users: users
        });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ message: "Failed to fetch videos" });
    }
};

export const AddNewUsers = async (req, res) => {
    try {
        const name    = req.body.name?.trim() || null;
        const email   = req.body.email?.trim() || null;
        const mobile  = req.body.phone?.trim() || null;
        const password= req.body.password?.trim() || null; 
        const file = req.file;

        console.log(file,"filename");
        

        // 🔑 FIX: Use emp_id (matches DB FK)
        const empId = req.user?.user_id || null;

        // ===== VALIDATION =====
        if (!name) {
            return res.status(400).json({ message: "UserName is required" });
        }

        if (!email) {
            return res.status(400).json({ message: "User Email is required" });
        }

        if (!mobile) {
            return res.status(400).json({ message: "User Mobile is required" });
        }

        if (!empId) {
            return res.status(401).json({ message: "Invalid user session" });
        }

        // ===== VIDEO URL =====
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/files/${file.filename}`;

        const filename = file.filename;
        const videoData = {
            name,
            email,
            mobile,
            password : md5(password),
            user_image: file.filename,
            image_url: imageUrl,
            created_at: new Date(),
            is_delete: 'Active'
        };
        const result = await addUploadVideoList(videoData);
        const AddUserData = {
            id: result.insertId,
            name: name,
            email: email,
            user_image: file.filename,
            image_url :imageUrl,
            role: userlist,
            is_delete: "Active",
            created_at: new Date(),
        };
        //emitVideoRefresh();
        res.status(201).json({
            message: "New User Added successfully",
            status: true,
            newAddUser: AddUserData,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Failed to upload video" });
    }
};
