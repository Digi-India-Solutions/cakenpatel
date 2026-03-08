const express = require("express");
const upload = require("../MiddleWare/Multer");
const { createReel, getAllReels, getReelById, updateReel, deleteReel, } = require("../Controller/ReelController.js");

const router = express.Router();


router.post("/create-reel", upload.fields([{ name: "video", maxCount: 1 }]), createReel);
router.get("/get-reels", getAllReels);
router.get("/get-single-reel/:id", getReelById);
router.put("/update-reel/:id", upload.fields([{ name: "video", maxCount: 1 },]), updateReel);
router.delete("/delete-reel/:id", deleteReel);

module.exports = router;
