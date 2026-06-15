// middleware/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// ESM dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload base folder
const uploadBase = path.join(__dirname, "../uploads");

// Ensure folders exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDir(uploadBase);
ensureDir(path.join(uploadBase, "videos"));
ensureDir(path.join(uploadBase, "files"));

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Video files go to videos folder
        if (file.mimetype.startsWith("video/")) {
            cb(null, path.join(uploadBase, "videos"));
        } else {
            cb(null, path.join(uploadBase, "files"));
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/\s+/g, "_");
        cb(null, `${timestamp}_${safeName}`);
    },
});

// File + Video filter
const fileFilter = (req, file, cb) => {
    const allowedTypes =
        /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mov|avi|mkv|webm/;

    const ext = path.extname(file.originalname).toLowerCase();
    const extValid = allowedTypes.test(ext);
    const mimeValid =
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("video/") ||
        file.mimetype === "application/pdf" ||
        file.mimetype.includes("word");

    if (extValid && mimeValid) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Allowed: images, documents, videos"
            )
        );
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB (video safe)
    },
});
