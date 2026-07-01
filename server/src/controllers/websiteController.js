import { getShopBooksData } from "../services/websiteService.js";


export const getShopBooksList = async (req,res) => {
    try {
        const shopbook = await getShopBooksData();
        return res.status(200).json({
            message: "All Books Fetched Successfully",
            success: true,
            shopbook: shopbook
        });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ message: "Failed to fetch Books" });
    }
};
