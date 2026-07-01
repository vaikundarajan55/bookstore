import pool from "../config/database.js";

export const getShopBooksData = async () => {
    try {
         const [rows] = await pool.execute(`
            SELECT *
            FROM book
            WHERE TRIM(is_delete) = 'Active'
            ORDER BY book_id DESC
        `);
        return rows;
        
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}
