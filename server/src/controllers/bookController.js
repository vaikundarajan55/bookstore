import { getAllBooksData } from "../services/bookService.js";


export const getAllBooksList = async (req,res) => {
    try {
        const books = await getAllBooksData();
        return res.status(200).json({
            message: "All Books Fetched Successfully",
            success: true,
            books: books
        });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ message: "Failed to fetch Books" });
    }
};