const express = require("express");
const upload = require("../MiddleWare/Multer");
const { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner } = require("../Controller/cakeBannerController");
const BannerRouter = express.Router();


BannerRouter.post("/upload-cake-banner", upload.single("cakeBanner"), createBanner);
BannerRouter.get("/get-cake-banner", getAllBanners);
BannerRouter.get("/get-single-cake-banner/:id", getBannerById);
BannerRouter.put("/update-cake-banner/:id", upload.single("cakeBanner"), updateBanner);
BannerRouter.delete("/delete-cake-banner/:id", deleteBanner);

module.exports = BannerRouter;
