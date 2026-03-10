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



// const multer = require("multer");
// const sharp = require("sharp");
// const path = require("path");
// const fs = require("fs");

// // ── Config ─────────────────────────────────────────────────────────────────────
// const UPLOAD_DIR = './Public'; // absolute — safe on all OS
// const MAX_FILE_SIZE = 5 * 1024 * 1024;                     // 5 MB per file
// const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp","video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
// const WEBP_QUALITY = 85;

// fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// // ── Helpers ────────────────────────────────────────────────────────────────────
// const sanitizeBasename = (originalname) => {
//     const ext = path.extname(originalname);
//     return path
//         .basename(originalname, ext)
//         .replace(/\s+/g, "-")
//         .replace(/[^a-zA-Z0-9\-_]/g, "");
// };

// const generateFilename = (originalname) => {
//     const basename = sanitizeBasename(originalname);
//     const random = Math.random().toString(36).slice(2, 8); // e.g. "k3x9mz"
//     return `${Date.now()}-${random}-${basename}.webp`;
// };

// // ── File type filter ───────────────────────────────────────────────────────────
// const fileFilter = (_req, file, cb) => {
//     if (ALLOWED_TYPES.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error(`Invalid file type "${file.mimetype}". Only JPEG, PNG, and WebP are allowed.`), false);
//     }
// };

// // ── Multer instance (memory storage) ──────────────────────────────────────────
// const _multer = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: MAX_FILE_SIZE },
//     fileFilter,
// });

// // ── Convert ONE file buffer → WebP → save to disk ─────────────────────────────
// const convertToWebP = async (file) => {
//     const filename = generateFilename(file.originalname);
//     const fullPath = path.join(UPLOAD_DIR, filename);

//     await sharp(file.buffer)
//         .webp({ quality: WEBP_QUALITY })
//         .toFile(fullPath);

//     // Overwrite multer fields so controllers work exactly as with diskStorage
//     file.filename = filename;
//     file.path = fullPath;           // absolute path (for deleteFile helper)
//     file.relativePath = `Public/${filename}`; // URL-safe, for DB storage
//     file.mimetype = "image/webp";
//     delete file.buffer;                     // free memory after conversion
// };

// // ── WebP conversion middleware (handles single / array / fields) ───────────────
// const webpMiddleware = async (req, res, next) => {
//     try {
//         // upload.single() → req.file (object)
//         if (req.file) {
//             await convertToWebP(req.file);
//         }

//         // upload.array() → req.files (flat Array)
//         if (Array.isArray(req.files) && req.files.length > 0) {
//             await Promise.all(req.files.map(convertToWebP));
//         }

//         // upload.fields() → req.files (Object: { fieldName: [file, ...] })
//         if (req.files && !Array.isArray(req.files)) {
//             const all = Object.values(req.files).flat();
//             if (all.length > 0) await Promise.all(all.map(convertToWebP));
//         }

//         next();
//     } catch (err) {
//         console.error("WebP conversion error:", err.message);
//         return res.status(500).json({ success: false, message: "Image processing failed. Please try again." });
//     }
// };

// // ── Export ─────────────────────────────────────────────────────────────────────

// const upload = {
//     single: (fieldName) => [_multer.single(fieldName), webpMiddleware],
//     array: (fieldName, maxCount) => [_multer.array(fieldName, maxCount), webpMiddleware],
//     fields: (fieldsArr) => [_multer.fields(fieldsArr), webpMiddleware],
// };

// module.exports = upload;



const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// ── Config ─────────────────────────────────────────
const IMAGE_DIR = "./Public";
const VIDEO_DIR = "./Public";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const WEBP_QUALITY = 85;

// Allowed types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp","image/avif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];


// ── Ensure folders exist ─────────────────────────
fs.mkdirSync(IMAGE_DIR, { recursive: true });
fs.mkdirSync(VIDEO_DIR, { recursive: true });


// ── Helpers ──────────────────────────────────────
const sanitizeBasename = (originalname) => {
  const ext = path.extname(originalname);

  return path
    .basename(originalname, ext)
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-_]/g, "");
};

const generateFilename = (originalname, ext) => {
  const base = sanitizeBasename(originalname);
  const rand = Math.random().toString(36).slice(2, 8);

  return `${Date.now()}-${rand}-${base}${ext}`;
};

const isImage = (type) => ALLOWED_IMAGE_TYPES.includes(type);
const isVideo = (type) => ALLOWED_VIDEO_TYPES.includes(type);


// ── Multer Storage ───────────────────────────────
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    if (isVideo(file.mimetype)) {
      cb(null, VIDEO_DIR);
    } else if (isImage(file.mimetype)) {
      cb(null, IMAGE_DIR);
    } else {
      cb(new Error("Unsupported file type"));
    }

  },

  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);
    const filename = generateFilename(file.originalname, ext);

    cb(null, filename);

  }

});


// ── File Filter ──────────────────────────────────
const fileFilter = (req, file, cb) => {

  if (isImage(file.mimetype) || isVideo(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }

};


// ── Multer Instance ──────────────────────────────
const uploadInstance = multer({

  storage,

  limits: {
    fileSize: MAX_VIDEO_SIZE
  },

  fileFilter

});


// ── Convert image to WebP ────────────────────────
const convertToWebP = async (file) => {

  if (!isImage(file.mimetype)) return;

  const newFilename = generateFilename(file.originalname, ".webp");
  const newPath = path.join(IMAGE_DIR, newFilename);

  await sharp(file.path)
    .webp({ quality: WEBP_QUALITY })
    .toFile(newPath);

  // delete original image
  fs.unlinkSync(file.path);

  file.filename = newFilename;
  file.path = newPath;
  file.relativePath = `Public/${newFilename}`;
  file.mimetype = "image/webp";

};


// ── Process Files Middleware ─────────────────────
const processFiles = async (req, res, next) => {

  try {

    if (req.file) {
      await convertToWebP(req.file);
    }

    if (req.files) {

      if (Array.isArray(req.files)) {

        for (const file of req.files) {
          await convertToWebP(file);
        }

      } else {

        for (const field in req.files) {

          for (const file of req.files[field]) {

            if (isImage(file.mimetype)) {
              await convertToWebP(file);
            } else {
              file.relativePath = `Public/${file.filename}`;
            }

          }

        }

      }

    }

    next();

  } catch (error) {

    console.error("File processing error:", error);

    res.status(500).json({
      success: false,
      message: "File processing failed"
    });

  }

};


// ── Export Helpers ───────────────────────────────
const upload = {

  single: (field) => [
    uploadInstance.single(field),
    processFiles
  ],

  array: (field, count = 5) => [
    uploadInstance.array(field, count),
    processFiles
  ],

  fields: (fields) => [
    uploadInstance.fields(fields),
    processFiles
  ]

};

module.exports = upload;