const express = require("express");
const upload = require("../MiddleWare/Multer");
const {
  createRecommendedProduct,
  getAllRecommendedProducts,
  getRecommendedProductById,
  updateRecommendedProduct,
  deleteRecommendedProduct,
  getActiveRecommendedProducts,
  getProductsByCategory,
} = require("../Controller/RecommendedProductController");

const router = express.Router();

router.post("/create-product", upload.array("productImage", 5), createRecommendedProduct);
router.get("/all-product", getAllRecommendedProducts);
router.get("/active-products", getActiveRecommendedProducts);
router.get("/get-product/:id", getRecommendedProductById);
router.get("/get-product-by-category/:categoryId", getProductsByCategory);
router.put("/update-product/:id", upload.array("productImage", 5), updateRecommendedProduct);
router.delete("/delete-product/:id", deleteRecommendedProduct);

module.exports = router;
