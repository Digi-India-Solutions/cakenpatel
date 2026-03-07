const express = require('express');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct,
    getProductByname, getBestSellingProducts, getProductsBySubcategoryId,changeStatus,
    getProductsBySubcategory, getProductsActiveonHome, getFeaturedProducts } = require('../Controller/ProductController');
const upload = require('../MiddleWare/Multer');
const ProductRouter = express.Router();

ProductRouter.post('/create-product', upload.array("productImage", 5), createProduct);
ProductRouter.get('/all-product', getProducts);
ProductRouter.get('/all-ProductActiveonHome', getProductsActiveonHome);
ProductRouter.get('/get-featuredProducts', getFeaturedProducts);
ProductRouter.get('/get-best-selling-products', getBestSellingProducts);
ProductRouter.get('/get-single-product/:id', getProduct);
ProductRouter.get('/get-product-by-name/:name', getProductByname);
ProductRouter.get('/get-product-by-subcatname/:subcategoryName', getProductsBySubcategory);
ProductRouter.get('/get-product-by-subCategoryId/:id', getProductsBySubcategoryId);
ProductRouter.put('/update-product/:id', upload.array("productImage", 5), updateProduct);
ProductRouter.delete('/delete-product/:id', deleteProduct);
ProductRouter.post('/change-status', changeStatus);

module.exports = ProductRouter;
