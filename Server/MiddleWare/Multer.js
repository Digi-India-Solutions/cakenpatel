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
const UPLOAD_DIR = './Public';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const WEBP_QUALITY = 85; // 0-100  (85 = great balance of quality vs file size)

// Ensure upload directory exists once at startup
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Helpers ────────────────────────────────────────────────────────────────────

const sanitizeBasename = (originalname) => {
    const ext = path.extname(originalname);
    return path
        .basename(originalname, ext)
        .replace(/\s+/g, "-")            // spaces → hyphens
        .replace(/[^a-zA-Z0-9\-_]/g, ""); // strip special characters
};

// ── Step 1: Multer — store upload temporarily in memory ───────────────────────
// memoryStorage lets Sharp process the buffer before writing to disk.
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(`Invalid file type "${file.mimetype}". Only JPEG, PNG, and WebP are allowed.`),
            false
        );
    }
};

const _multer = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});

// ── Step 2: Sharp middleware — convert buffer → WebP → save to disk ───────────

const webpConverter = (fieldName) => [
    _multer.single(fieldName),

    async (req, res, next) => {
        if (!req.file) return next(); // field is optional — skip if absent

        try {
            const basename = sanitizeBasename(req.file.originalname);
            const filename = `${Date.now()}-${basename}.webp`;
            const fullPath = path.join(UPLOAD_DIR, filename);

            // Convert to WebP and write to disk
            await sharp(req.file.buffer)
                .webp({ quality: WEBP_QUALITY })
                .toFile(fullPath);

            // Populate req.file so controllers work exactly as before
            req.file.filename = filename;
            req.file.path = fullPath;                        // absolute path
            req.file.relativePath = path.join("Public", filename);  // for storing in DB
            req.file.mimetype = "image/webp";

            next();
        } catch (err) {
            console.error("WebP conversion error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Image processing failed. Please try again.",
            });
        }
    },
];

// ── Export ─────────────────────────────────────────────────────────────────────

const upload = {
    single: (fieldName) => webpConverter(fieldName),
    fields: (fieldsArr) => webpConverter(_multer.fields(fieldsArr)),
    array: (fieldName, maxCount) => webpConverter(_multer.array(fieldName, maxCount)),
};

module.exports = upload;