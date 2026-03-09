// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // ── Config ────────────────────────────────────────────────────────────────────
// const UPLOAD_DIR = path.join(__dirname, "..", "Public");
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
// const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// // Ensure upload directory exists at startup
// fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// // ── Storage ───────────────────────────────────────────────────────────────────

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = "./Public";
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + file.originalname);
//     }
// });

// // ── File type filter ──────────────────────────────────────────────────────────
// const fileFilter = (_req, file, cb) => {
//     if (ALLOWED_TYPES.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only JPEG, PNG, and WebP images are allowed."), false);
//     }
// };

// // ── Export ────────────────────────────────────────────────────────────────────
// const upload = multer({
//     storage,
//     limits: { fileSize: MAX_FILE_SIZE },
//     fileFilter,
// });

// module.exports = upload;

// // const multer = require("multer");
// // const path = require("path");
// // const fs = require("fs");

// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         const dir = "./Public";
// //         if (!fs.existsSync(dir)) {
// //             fs.mkdirSync(dir, { recursive: true });
// //         }
// //         cb(null, dir);
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + file.originalname);
// //     }
// // });

// // const upload = multer({ storage });

// // module.exports = upload;



const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// ── Config ─────────────────────────────────────────────────────────────────────
const UPLOAD_DIR = './Public'; // absolute — safe on all OS
const MAX_FILE_SIZE = 5 * 1024 * 1024;                     // 5 MB per file
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const WEBP_QUALITY = 85;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Helpers ────────────────────────────────────────────────────────────────────
const sanitizeBasename = (originalname) => {
    const ext = path.extname(originalname);
    return path
        .basename(originalname, ext)
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-_]/g, "");
};

const generateFilename = (originalname) => {
    const basename = sanitizeBasename(originalname);
    const random = Math.random().toString(36).slice(2, 8); // e.g. "k3x9mz"
    return `${Date.now()}-${random}-${basename}.webp`;
};

// ── File type filter ───────────────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type "${file.mimetype}". Only JPEG, PNG, and WebP are allowed.`), false);
    }
};

// ── Multer instance (memory storage) ──────────────────────────────────────────
const _multer = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});

// ── Convert ONE file buffer → WebP → save to disk ─────────────────────────────
const convertToWebP = async (file) => {
    const filename = generateFilename(file.originalname);
    const fullPath = path.join(UPLOAD_DIR, filename);

    await sharp(file.buffer)
        .webp({ quality: WEBP_QUALITY })
        .toFile(fullPath);

    // Overwrite multer fields so controllers work exactly as with diskStorage
    file.filename = filename;
    file.path = fullPath;           // absolute path (for deleteFile helper)
    file.relativePath = `Public/${filename}`; // URL-safe, for DB storage
    file.mimetype = "image/webp";
    delete file.buffer;                     // free memory after conversion
};

// ── WebP conversion middleware (handles single / array / fields) ───────────────
const webpMiddleware = async (req, res, next) => {
    try {
        // upload.single() → req.file (object)
        if (req.file) {
            await convertToWebP(req.file);
        }

        // upload.array() → req.files (flat Array)
        if (Array.isArray(req.files) && req.files.length > 0) {
            await Promise.all(req.files.map(convertToWebP));
        }

        // upload.fields() → req.files (Object: { fieldName: [file, ...] })
        if (req.files && !Array.isArray(req.files)) {
            const all = Object.values(req.files).flat();
            if (all.length > 0) await Promise.all(all.map(convertToWebP));
        }

        next();
    } catch (err) {
        console.error("WebP conversion error:", err.message);
        return res.status(500).json({ success: false, message: "Image processing failed. Please try again." });
    }
};

// ── Export ─────────────────────────────────────────────────────────────────────

const upload = {
    single: (fieldName) => [_multer.single(fieldName), webpMiddleware],
    array: (fieldName, maxCount) => [_multer.array(fieldName, maxCount), webpMiddleware],
    fields: (fieldsArr) => [_multer.fields(fieldsArr), webpMiddleware],
};

module.exports = upload;
