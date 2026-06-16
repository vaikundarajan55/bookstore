import { getAllUsersData , addNewUserData} from "../services/userService.js";
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
        console.log("req.body :", req.body);
        console.log("req.file :", req.file);
        console.log("req.user :", req.user);

        const name     = req.body.name?.trim()     || null;
        const email    = req.body.email?.trim()    || null;
        const mobile   = req.body.mobile?.trim()    || null;
        const password = req.body.password?.trim() || null;  // ✅ Fixed
        const role     = req.body.role?.trim()     || "User";
        const status   = req.body.status?.trim()   || "Active";
        const file     = req.file || null;

        console.log("Image File :", file?.filename); // ✅ Fixed: was req.image

        const empId = req.user?.user_id || null;

        // ===== VALIDATION =====
        if (!name)     return res.status(400).json({ status: false, message: "Username is required" });
        if (!email)    return res.status(400).json({ status: false, message: "Email is required" });
        if (!mobile)   return res.status(400).json({ status: false, message: "Mobile is required" });
        if (!password) return res.status(400).json({ status: false, message: "Password is required" }); // ✅ Prevents md5(null) crash
        if (!empId)    return res.status(401).json({ status: false, message: "Invalid user session" });
        if (!file)     return res.status(400).json({ status: false, message: "Profile image is required" });

        // ===== BUILD IMAGE URL =====
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/files/${file.filename}`;

        // ===== INSERT DATA =====
        const UserData = {
            name,
            email,
            mobile,
            password:   md5(password),  // ✅ Safe — password validated above
            role,
            user_image: file.filename,
            image_url:  imageUrl,
            is_delete:  status,
            created_at: new Date(),
        };

        const result = await addNewUserData(UserData);

        // ===== RESPONSE =====
        const AddUserData = {
            id:         result.insertId,
            name,
            email,
            mobile,
            role,
            user_image: file.filename,
            image_url:  imageUrl,
            is_delete:  status,
            created_at: new Date(),
        };

        return res.status(201).json({
            status:     true,
            message:    "New User Added Successfully",
            newAddUser: AddUserData,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ 
            status:  false, 
            message: "Failed to add user",
            error:   error.message  // ✅ Shows actual error in response
        });
    }
};