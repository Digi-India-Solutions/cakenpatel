const fs = require("fs");
const path = require("path");
const PromoBanner = require("../Model/PromoBannerModel");


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

const createBanner = async (req, res) => {
    try {
        const { bannerKey, isActive } = req.body;
        const errorMessage = [];
        if (!bannerKey) errorMessage.push("Banner Name is required");
        // if (!bannerType) errorMessage.push("Banner Type is required");
        if (!req.file) errorMessage.push("Banner Image is required");

        if (errorMessage.length) {
            if (req.file) fs.unlinkSync(req.file.path); // Remove uploaded image if validation fails
            return res.status(400).json({ success: false, message: errorMessage.join(", ") });
        }

        const banner = new PromoBanner({
            bannerKey,
            image: req.file.path, // Save the file path
            // bannerType,
            isActive: isActive || "False",
        });
        await banner.save();
        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // Delete image if there’s an error during saving
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getAllBanners = async (req, res) => {
    try {
        const banners = await PromoBanner.find();
        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getBannerById = async (req, res) => {
    try {
        const banner = await PromoBanner.findById(req.params.id);
        if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { bannerKey, bannerStatus, isActive } = req.body;
        const banner = await PromoBanner.findById(id);
        if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

        // Delete old image if a new one is uploaded
        if (req.file && banner.image) {
            deleteImageFile(banner.image);
            banner.image = req.file.path;
        }

        // Update banner details
        banner.bannerKey = bannerKey || banner.bannerKey;
        // banner.bannerType = bannerType || banner.bannerType;
        banner.isActive = isActive || banner.isActive;

        await banner.save();
        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path); // Delete new image if there’s an error
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await PromoBanner.findByIdAndDelete(id);
        if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

        // Delete the image file
        if (banner.image) deleteImageFile(banner.image);

        res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};