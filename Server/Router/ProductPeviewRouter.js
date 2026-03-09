const express = require("express");
const {
    createProductPreview, getAllProductPreview, getSingleProductPreview, getPreviewByProductId, updateProductPreview, deleteProductPreview, changePreviewStatus
} = require("../Controller/ProductPreviewController");
const upload = require("../MiddleWare/Multer");
const ProductPreviewRouter = express.Router();

// CREATE
ProductPreviewRouter.post("/create-product-preview", upload.array("previewImage", 5), createProductPreview);

// GET ALL
ProductPreviewRouter.get("/all-product-preview", getAllProductPreview);

// GET SINGLE
ProductPreviewRouter.get("/get-single-preview/:id", getSingleProductPreview);

// GET BY PRODUCT
ProductPreviewRouter.get("/get-preview-by-product/:productId", getPreviewByProductId);

// UPDATE
ProductPreviewRouter.put("/update-preview/:id", upload.array("previewImage", 5), updateProductPreview);

// DELETE
ProductPreviewRouter.delete("/delete-preview/:id", deleteProductPreview);

// CHANGE STATUS
ProductPreviewRouter.patch("/change-preview-status", changePreviewStatus);

module.exports = ProductPreviewRouter;