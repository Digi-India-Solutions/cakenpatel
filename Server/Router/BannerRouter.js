// const express = require("express");
// const upload = require("../MiddleWare/Multer");
// const { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner, bannerStatusBanner } = require("../Controller/BannerController");
// const BannerRouter = express.Router();


// BannerRouter.post("/create-banner", upload.single("bannerImage"), createBanner);
// BannerRouter.get("/get-banners", getAllBanners);
// BannerRouter.get("/get-single-banner/:id", getBannerById);
// BannerRouter.put("/update-banner/:id", upload.single("bannerImage"), updateBanner);
// BannerRouter.delete("/delete-banner/:id", deleteBanner);
// BannerRouter.put("/banner/status-banner/:id", bannerStatusBanner);
// module.exports = BannerRouter;

/**
 * Routes/BannerRouter.js
 */

const express = require("express");
const upload = require("../MiddleWare/Multer");
const handleMulterError = require("../MiddleWare/handleMulterError");
const {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    bannerStatusBanner,
} = require("../Controller/BannerController");

const BannerRouter = express.Router();

// ── Multer error handler (file size / type rejections) ────────────────────────
// const handleMulterError = (err, _req, res, next) => {
//     if (err?.code === "LIMIT_FILE_SIZE") {
//         return res.status(413).json({ success: false, message: "Image too large. Max size is 5 MB." });
//     }
//     if (err?.message) {
//         return res.status(400).json({ success: false, message: err.message });
//     }
//     next(err);
// };

// const uploadSingle = (field) => [
//     upload.single(field),
//     handleMulterError,
// ];

// ── Banner routes ─────────────────────────────────────────────────────────────
BannerRouter.post("/create-banner", handleMulterError, upload.single("bannerImage"), createBanner);
BannerRouter.get("/get-banners", getAllBanners);
BannerRouter.get("/get-single-banner/:id", getBannerById);
BannerRouter.put("/update-banner/:id", handleMulterError, upload.single("bannerImage"), updateBanner);
BannerRouter.delete("/delete-banner/:id", deleteBanner);
BannerRouter.put("/banner/status-banner/:id", bannerStatusBanner);

module.exports = BannerRouter;