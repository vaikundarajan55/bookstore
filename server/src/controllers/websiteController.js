import { getShopBooksData } from "../services/websiteService.js";


export const getShopBooksList = async (req,res) => {
    try {
        const shopbook = await getShopBooksData();
        if (!shopbook) {
            return res.status(404).json({ message: "No books found" });
        }
        return res.status(200).json({
            message: "All Books Fetched Successfully",
            success: true,
            shopbook: shopbook
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch Books" });
    }
};
