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
        const { name, email, mobile, password, user_image,image_url,created_at,role } = videoData;

    try {
        const [rows] = await pool.execute(
            `INSERT INTO workflow_videolist (name, email, mobile, password, user_image,image_url,created_at,role) VALUES (?, ?, ?, ?,?, ?, ?, ?)`,
            [name, email, mobile, password, user_image,image_url,created_at,role]
        );
        return rows;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }

};