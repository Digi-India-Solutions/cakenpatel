// import Reel from "../Model/ReelModel.js";
const Reel = require("../Model/ReelModel");
const fs = require("fs");
const path = require("path");

const deleteImageFile = (relativeFilePath) => {
  const absolutePath = path.join(__dirname, "..", relativeFilePath);
  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error("Failed to delete image:", err);
    } else {
      console.log("Image deleted:", absolutePath);
    }
  });
};

// /* CREATE */
const createReel = async (req, res) => {
  try {
    const { title, price, activeOnHome, productId } = req.body;
    
    const newReel = new Reel({
      title,
      productId,
      price,
      video: req.files.video[0].path,
      activeOnHome,
    });

    await newReel.save();

    res.status(201).json({ success: true, message: "Reel created", data: newReel });
  } catch (err) {
    console.error("Error creating reel:==>", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET ALL */
const getAllReels = async (req, res) => {
  const reels = await Reel.find().sort({ createdAt: -1 }).populate("productId");
  res.json({ success: true, data: reels });
};

/* GET ONE */
const getReelById = async (req, res) => {
  const reel = await Reel.findById(req.params.id).populate("productId");
  res.json({ success: true, data: reel });
};

/* UPDATE */
const updateReel = async (req, res) => {
  const { title, price, activeOnHome, productId } = req.body;

  const updateData = { title, price, activeOnHome, productId };

  if (req.files?.video) updateData.video = req.files.video[0].path;

  const reel = await Reel.findByIdAndUpdate(req.params.id, updateData, { new: true });

  res.json({ success: true, message: "Reel updated", data: reel });
};

/* DELETE */
const deleteReel = async (req, res) => {
  await Reel.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Reel deleted" });
};

module.exports = {
  createReel, getAllReels, getReelById, updateReel, deleteReel
};