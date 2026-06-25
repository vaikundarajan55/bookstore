import { getAllBooksData , addNewBookData, getBookById, updateBookData, deleteBookData} from "../services/bookService.js";


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
export const AddNewBook = async (req, res) => {
    try {
      
        const book_name   = req.body.book_name?.trim()     || null;
        const book_price  = req.body.book_price?.trim()    || null;
        const book_author = req.body.book_author?.trim()    || null;
        const book_year   = req.body.book_year?.trim() || null;  // ✅ Fixed
        const is_delete   = req.body.is_delete?.trim()   || "Active";
        const file        = req.file || null;
        

        const empId = req.user?.user_id || null;

        // ===== VALIDATION =====
        if (!book_name)     return res.status(400).json({ status: false, message: "Bookname is required" });
        if (!book_price)    return res.status(400).json({ status: false, message: "BookPrice is required" });
        if (!book_author)   return res.status(400).json({ status: false, message: "Book Author is required" });
        if (!book_year) return res.status(400).json({ status: false, message: "Book Year is required" }); // ✅ Prevents md5(null) crash
        if (!empId)    return res.status(401).json({ status: false, message: "Invalid user session" });
        if (!file)     return res.status(400).json({ status: false, message: "Profile image is required" });

        // ===== BUILD IMAGE URL =====
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/files/${file.filename}`;

        // ===== INSERT DATA =====
        const BookData = {
            book_name,
            book_price,
            book_author,
            book_year,  
            book_image: file.filename,
            book_image_url:  imageUrl,
            created_at: new Date(),
        };

        const result = await addNewBookData(BookData);

        // ===== RESPONSE =====
        const AddBookData = {
            book_id:    result.insertId,
            book_name,
            book_price,
            book_author,
            book_year,
            book_image: file.filename,
            book_image_url:  imageUrl,
            is_delete:  "Active",
            created_at: new Date(),
        };

        return res.status(201).json({
            status:     true,
            message:    "New Book Added Successfully",
            newAddBook: AddBookData,
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

export const EditNeweBookData = async (req, res) => {
    try {
        const book_id     = req.body.book_id;
        const book_name   = req.body.book_name?.trim()     || null;
        const book_price  = req.body.book_price?.trim()    || null;
        const book_author = req.body.book_author?.trim()    || null;
        const book_year   = req.body.book_year?.trim() || null;  // ✅ Fixed
        const is_delete   = req.body.is_delete?.trim()   || "Active";
        const file        = req.file || null;

        if (!book_name)     return res.status(400).json({ status: false, message: "Bookname is required" });
        if (!book_price)    return res.status(400).json({ status: false, message: "BookPrice is required" });
        if (!book_author)   return res.status(400).json({ status: false, message: "Book Author is required" });
        if (!book_year) return res.status(400).json({ status: false, message: "Book Year is required" }); 

        const existingBook = await getBookById(book_id); // your DB fetch function
        
        // ✅ Only update image if new file uploaded, else keep existing
        let imageFilename = existingBook.book_image;
        let imageUrl      = existingBook.image_url;

        if (file) {
            imageFilename = file.filename;
            imageUrl      = `${req.protocol}://${req.get("host")}/uploads/files/${file.filename}`;
            console.log("New image uploaded:", imageFilename);
        } else {
            console.log("No new image — keeping existing:", imageFilename);
        }
         const UpdateData = {
            book_id,
            book_name:   book_name   ?? null,
            book_price:  book_price  ?? null,
            book_year:   book_year   ?? null,
            book_author: book_author  ?? null,
            book_image: imageFilename ?? null,
            book_image_url:  imageUrl      ?? null,
        };

        const result = await updateBookData(UpdateData); // your DB update function

        return res.status(200).json({
            status:  true,
            message: "User Updated Successfully",
            user: {
                book_id,
                book_name,
                book_price,
                book_year,
                book_author,
                is_delete:  "Active",
                book_image: imageFilename,
                book_image_url:  imageUrl,
            }
        });

       
    } catch (error) {
        return res.status(500).json({ 
            status:  false, 
            message: "Failed to update user",
            error:   error.message
        });
        
    }
};
export const DeleteBook = async (req, res) => {
    try {
        const { book_id } = req.params;

        console.log("Delete User ID:", book_id);

        if (!book_id) {
            return res.status(400).json({ 
                status:  false, 
                message: "Book ID is required" 
            });
        }

        // ✅ Check user exists before deleting
        const existingBook = await getBookById(book_id);
        if (!existingBook) {
            return res.status(404).json({ 
                status:  false, 
                message: "User not found" 
            });
        }
        const DeleteData = {
            book_id,
            is_delete: 'Inactive',
        };
        await deleteBookData(DeleteData);

        return res.status(200).json({
            status:  true,
            message: "Book deleted successfully",
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