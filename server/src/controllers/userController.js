import { getAllUsersData , addNewUserData, updateUserData, getUserById, deleteUserData} from "../services/userService.js";
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
        return res.status(500).json({ message: "Failed to fetch Users" });
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
export const EditNeweUserData = async(req, res) => {
     try {
        console.log("req.body :", req.body);
        console.log("req.file :", req.file);

        const id       = req.body.id;
        const name     = req.body.name?.trim()   || null;
        const email    = req.body.email?.trim()  || null;
        const mobile   = req.body.mobile?.trim() || null;
        const role     = req.body.role?.trim()   || null;
        const status   = req.body.status?.trim() || null;
        const password = req.body.password?.trim() || null;
        const file     = req.file || null;

        if (!id)     return res.status(400).json({ status: false, message: "User ID is required" });
        if (!name)   return res.status(400).json({ status: false, message: "Name is required" });
        if (!email)  return res.status(400).json({ status: false, message: "Email is required" });

        // ✅ Get existing user first
        const existingUser = await getUserById(id); // your DB fetch function

        // ✅ Only update image if new file uploaded, else keep existing
        let imageFilename = existingUser.user_image;
        let imageUrl      = existingUser.image_url;

        if (file) {
            imageFilename = file.filename;
            imageUrl      = `${req.protocol}://${req.get("host")}/uploads/files/${file.filename}`;
            console.log("New image uploaded:", imageFilename);
        } else {
            console.log("No new image — keeping existing:", imageFilename);
        }

        // ✅ Only update password if provided
        const updatedPassword = password ? md5(password) : existingUser.password;

        const UpdateData = {
            id,
            name:       name       ?? null,
            email:      email      ?? null,
            mobile:     mobile     ?? null,
            role:       role       ?? null,
            is_delete:  status     ?? null,  // ✅ maps status → is_delete
            user_image: imageFilename ?? null,
            image_url:  imageUrl      ?? null,
            password:   updatedPassword ?? null,
        };

        const result = await updateUserData(UpdateData); // your DB update function

        return res.status(200).json({
            status:  true,
            message: "User Updated Successfully",
            user: {
                id,
                name,
                email,
                mobile,
                role,
                is_delete:  status,
                user_image: imageFilename,
                image_url:  imageUrl,
            }
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ 
            status:  false, 
            message: "Failed to update user",
            error:   error.message
        });
    }
};
export const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Delete User ID:", id);

        if (!id) {
            return res.status(400).json({ 
                status:  false, 
                message: "User ID is required" 
            });
        }

        // ✅ Check user exists before deleting
        const existingUser = await getUserById(id);
        if (!existingUser) {
            return res.status(404).json({ 
                status:  false, 
                message: "User not found" 
            });
        }
        const DeleteData = {
            id,
            is_delete: 'Inactive',
        };
        await deleteUserData(DeleteData);

        return res.status(200).json({
            status:  true,
            message: "User deleted successfully",
            id
        });

    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ 
            status:  false, 
            message: "Failed to delete user",
            error:   error.message
        });
    }
};