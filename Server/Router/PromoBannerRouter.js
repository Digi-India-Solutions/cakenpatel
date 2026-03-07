const express = require("express");
const upload = require("../MiddleWare/Multer");
const {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner
} = require("../Controller/PromoBannerController");
const PromoBannerRouter = express.Router();


PromoBannerRouter.post("/upload-promo-banner", upload.single("image"), createBanner);
PromoBannerRouter.get("/get-promo-banner", getAllBanners);
PromoBannerRouter.get("/get-single-promo-banner/:id", getBannerById);
PromoBannerRouter.put("/update-promo-banner/:id", upload.single("image"), updateBanner);
PromoBannerRouter.delete("/delete-promo-banner/:id", deleteBanner);

module.exports = PromoBannerRouter;
