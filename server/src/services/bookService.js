import pool from "../config/database.js";

export const getAllBooksData = async () => {
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
export const addNewBookData = async (BookData) => {
        const { book_name, book_price, book_author, book_year, book_image,book_image_url,created_at} = BookData;

    try {
        const [rows] = await pool.execute(
            `INSERT INTO book (book_name, book_price, book_author, book_year, book_image,book_image_url,created_at) VALUES (?, ?, ?, ?,?, ?, ?)`,
            [book_name, book_price, book_author, book_year, book_image,book_image_url,created_at]
        );
        return rows;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
};
export const getBookById = async (book_id) => {
    try {
        const [bookDetails] = await pool.execute(
            `SELECT * From book WHERE book_id = ?`,
            [book_id]
        );
        return bookDetails[0] || null;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};
export const updateBookData = async (UpdateData) => {
    const { book_name, book_price, book_author, book_year, book_image,book_image_url, book_id } = UpdateData;
    console.log(book_id);
    
    try {
        const [rows] = await pool.execute(
            `UPDATE book 
             SET 
                book_name      = ?, 
                book_price     = ?, 
                book_author    = ?, 
                book_year      = ?, 
                book_image     = ?, 
                book_image_url = ?
             WHERE book_id = ?`,
            [
                book_name   ?? null,
                book_price  ?? null,
                book_author ?? null,
                book_year   ?? null,
                book_image  ?? null,
                book_image_url ?? null,
                book_id
            ]
        );
        return rows;
    } catch (error) {
        console.error("Update User Data error:", error);
        throw error; // ✅ throw so controller catches it
    }
};
export const deleteBookData = async (DeleteData) => {
       const { book_id, is_delete } = DeleteData;
    try {
        const [rows] = await pool.execute(
            `UPDATE book SET is_delete = ? WHERE book_id = ?`,
            [is_delete, book_id] // ✅ now defined
        );
        return rows;
    } catch (error) {
        console.error("Delete User Data error:", error);
        throw error;
    }
};