const RecommendedCategory = require("../Model/RecommendedCategoryModel");
const fs = require("fs");
const RecommendedProduct = require("../Model/RecommendedProductModel");

/* CREATE */
exports.createRecommendedCategory = async (req, res) => {
  try {
    const { name, ActiveonHome } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({ success: false, message: "Name & image required" });
    }

    const exists = await RecommendedCategory.findOne({ name: name.trim() });
    if (exists) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await RecommendedCategory.create({
      name: name.trim(),
      image: req.file.path,
      ActiveonHome,
    });

    res.status(201).json({ success: true, message: "Created", data: category });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET ALL */
exports.getAllRecommendedCategories = async (req, res) => {
  const data = await RecommendedCategory.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

/* GET ACTIVE */
exports.getActiveRecommendedCategories = async (req, res) => {
  const data = await RecommendedCategory.find({ ActiveonHome: true });
  res.json({ success: true, data });
};

/* GET SINGLE */
exports.getRecommendedCategoryById = async (req, res) => {
  const data = await RecommendedCategory.findById(req.params.id);
  if (!data) return res.status(404).json({ message: "Not found" });
  res.json({ success: true, data });
};

/* UPDATE */
exports.updateRecommendedCategory = async (req, res) => {
  try {
    const { name, ActiveonHome } = req.body;
    const category = await RecommendedCategory.findById(req.params.id);

    if (!category) return res.status(404).json({ message: "Not found" });

    if (name) category.name = name.trim();
    if (typeof ActiveonHome !== "undefined") category.ActiveonHome = ActiveonHome;

    if (req.file) {
      if (category.image) fs.unlinkSync(category.image);
      category.image = req.file.path;
    }

    await category.save();
    res.json({ success: true, message: "Updated", data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* DELETE */

exports.deleteRecommendedCategory = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= CATEGORY FIND ================= */
    const category = await RecommendedCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    /* ================= FIND RELATED PRODUCTS ================= */
    const products = await RecommendedProduct.find({
      recommendedCategoryName: id,
    });

    /* ================= DELETE CATEGORY IMAGE ================= */
    if (category.image && fs.existsSync(category.image)) {
      try {
        fs.unlinkSync(category.image);
      } catch (err) {
        console.warn("Category image delete failed:", err.message);
      }
    }

    /* ================= DELETE PRODUCTS ================= */
    for (const p of products) {
      try {
        // delete product image safely
        if (p.productImage && fs.existsSync(p.productImage)) {
          fs.unlinkSync(p.productImage);
        }

        await RecommendedProduct.findByIdAndDelete(p._id);
      } catch (err) {
        console.warn("Product delete issue:", err.message);
      }
    }

    /* ================= DELETE CATEGORY ================= */
    await RecommendedCategory.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Recommended category and related products deleted successfully",
    });
  } catch (error) {
    console.error("Delete recommended category error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting category",
    });
  }
};
