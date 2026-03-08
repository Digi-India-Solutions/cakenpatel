const RecommendedProduct = require("../Model/RecommendedProductModel");
const RecommendedCategory = require("../Model/RecommendedCategoryModel");
const fs = require("fs");
const path = require("path");

const deleteImageFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  fs.unlink(fullPath, (err) => err && console.error("Delete failed:", err));
};


// CREATE
exports.createRecommendedProduct = async (req, res) => {
  try {
    const { recommendedCategoryName, productName, price, ActiveonHome } = req.body;

    if (!recommendedCategoryName || !productName || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!req.files?.length) {
      return res.status(400).json({ message: "Images required" });
    }

    const category = await RecommendedCategory.findById(recommendedCategoryName);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const product = await RecommendedProduct.create({
      recommendedCategoryName,
      productName,
      price,
      ActiveonHome,
      productImage: req.files.map((f) => f.path),
    });

    res.status(201).json({ message: "Product created", data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL
exports.getAllRecommendedProducts = async (req, res) => {
  const products = await RecommendedProduct.find()
    .populate("recommendedCategoryName")
    .sort({ createdAt: -1 });

  res.json({ data: products });
};


// GET ACTIVE
exports.getActiveRecommendedProducts = async (req, res) => {
  const products = await RecommendedProduct.find({ ActiveonHome: true })
    .populate("recommendedCategoryName");

  res.json({ data: products });
};


// GET BY ID
exports.getRecommendedProductById = async (req, res) => {
  const product = await RecommendedProduct.findById(req.params.id)
    .populate("recommendedCategoryName");

  if (!product) return res.status(404).json({ message: "Not found" });
  res.json({ data: product });
};


// GET BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  const products = await RecommendedProduct.find({
    recommendedCategoryName: req.params.categoryId,
  }).populate("recommendedCategoryName");

  res.json({ data: products });
};


// UPDATE
exports.updateRecommendedProduct = async (req, res) => {
  try {
    const product = await RecommendedProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    const { productName, price, ActiveonHome, recommendedCategoryName } = req.body;

    if (productName) product.productName = productName;
    if (price) product.price = price;
    if (ActiveonHome !== undefined) product.ActiveonHome = ActiveonHome;
    if (recommendedCategoryName) product.recommendedCategoryName = recommendedCategoryName;

    if (req.files?.length) {
      product.productImage.forEach(deleteImageFile);
      product.productImage = req.files.map((f) => f.path);
    }

    await product.save();
    res.json({ message: "Updated", data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE
exports.deleteRecommendedProduct = async (req, res) => {
  const product = await RecommendedProduct.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Not found" });

  product.productImage.forEach(deleteImageFile);
  await product.deleteOne();

  res.json({ message: "Deleted successfully" });
};
