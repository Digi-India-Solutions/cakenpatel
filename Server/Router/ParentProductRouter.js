const express = require("express");
const {
    createParentProduct, getAllParentProduct, getSingleParentProduct, updateParentProduct,
    deleteParentProduct, getAllParentProductStatusTrue, getSingleParentProductByName,
} = require("../Controller/ParentProductController");

const ParentProductRouter = express.Router();

// ✅ CRUD routes
ParentProductRouter.post("/create-parent-product", createParentProduct);
ParentProductRouter.get("/get-parent-product", getAllParentProduct);
ParentProductRouter.get("/get-parent-product-by-status", getAllParentProductStatusTrue);
ParentProductRouter.get("/get-single-parent-product/:id", getSingleParentProduct);
ParentProductRouter.get("/get-parent-product/by-name/:name", getSingleParentProductByName);
ParentProductRouter.put("/update-parent-product/:id", updateParentProduct);
ParentProductRouter.delete("/delete-parent-product/:id", deleteParentProduct);

module.exports = ParentProductRouter;