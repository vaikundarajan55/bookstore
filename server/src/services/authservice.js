import pool from "../config/database.js";

export const loginUser = async (credentials) => {
    try {
        const { email, password } = credentials;

        const [rows] = await pool.execute(
            `SELECT * FROM users 
             WHERE email = ? 
             AND is_delete = ?`,
            [email, "Active"]
        );
        return rows.length ? rows[0] : null;
        //return rows[0];
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};
