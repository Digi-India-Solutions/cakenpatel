const express = require("express");
const upload = require("../MiddleWare/Multer");
const { createReel, getAllReels, getReelById, updateReel, deleteReel, } = require("../Controller/ReelController.js");

const router = express.Router();
const uploadReel = upload.fields([
    { name: "video", maxCount: 1 }, // MP4, MOV, AVI, WebM
    { name: "thumbnail", maxCount: 1 }, // JPEG, PNG, WebP → auto WebP
]);

router.post("/create-reel", ...uploadReel, createReel);
router.get("/get-reels", getAllReels);
router.get("/get-single-reel/:id", getReelById);
router.put("/update-reel/:id", ...uploadReel, updateReel);
router.delete("/delete-reel/:id", deleteReel);

module.exports = router;
