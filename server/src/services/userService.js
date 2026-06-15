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