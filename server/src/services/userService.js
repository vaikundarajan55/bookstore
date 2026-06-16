import pool from "../config/database.js";
export const getAllUsersData = async () => {
    try {        
        const [rows] = await pool.execute(`
            SELECT *
            FROM users
            WHERE TRIM(is_delete) = 'Active'
            ORDER BY id DESC
        `);
        return rows;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};
export const addNewUserData = async (UserData) => {
        const { name, email, mobile, password, user_image,image_url,created_at,role } = UserData;

    try {
        const [rows] = await pool.execute(
            `INSERT INTO users (name, email, mobile, password, user_image,image_url,created_at,role) VALUES (?, ?, ?, ?,?, ?, ?, ?)`,
            [name, email, mobile, password, user_image,image_url,created_at,role]
        );
        return rows;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }

};

export const getUserById = async (id) => {
    try {
        const [userDetails] = await pool.execute(
            `SELECT * From users WHERE id = ?`,
            [id]
        );
        return userDetails[0] || null;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};

export const updateUserData = async (UpdateData) => {
    const { name, email, mobile, password, user_image, image_url, role, is_delete, id } = UpdateData;

    try {
        // ✅ Fixed SQL - was missing = ? after role
        // ✅ Removed created_at (shouldn't update creation date)
        // ✅ Added is_delete (status field)
        const [rows] = await pool.execute(
            `UPDATE users 
             SET 
                name        = ?, 
                email       = ?, 
                mobile      = ?, 
                password    = ?, 
                user_image  = ?, 
                image_url   = ?, 
                role        = ?,
                is_delete   = ?
             WHERE id = ?`,
            [
                name        ?? null,
                email       ?? null,
                mobile      ?? null,
                password    ?? null,
                user_image  ?? null,
                image_url   ?? null,
                role        ?? null,
                is_delete   ?? null,
                id
            ]
        );
        return rows;
    } catch (error) {
        console.error("Update User Data error:", error);
        throw error; // ✅ throw so controller catches it
    }
};

export const deleteUserData = async (DeleteData) => {
       const { id, is_delete } = DeleteData;
    try {
        const [rows] = await pool.execute(
            `UPDATE users SET is_delete = ? WHERE id = ?`,
            [is_delete, id] // ✅ now defined
        );
        return rows;
    } catch (error) {
        console.error("Delete User Data error:", error);
        throw error;
    }
};