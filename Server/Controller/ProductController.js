const fs = require('fs');
const path = require('path');
const Product = require('../Model/ProductModel');
const mongoose = require("mongoose")


// deleteImageFile function to delete images
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


const createProduct = async (req, res) => {
    const { categoryName, subcategoryName, secondsubcategoryName, parentProductId, ActiveonDeliveryDate, productName, productDescription, productDetails, Variant,
        ActiveonHome, FeaturedProducts, ActiveonFlavours, NameOnCake, BestSellingProduct, deliveryTo60Min, eggless, recommendedProductId } = req.body;
    const errorMessage = [];
    console.log('req.body==>', req.body)
    // Validation for required fields
    // if (!categoryName) errorMessage.push("Category Name is required");
    // if (!subcategoryName) errorMessage.push("Subcategory Name is required");
    // if (!secondsubcategoryName) errorMessage.push("Second Subcategory Name is required");
    if (!productName) errorMessage.push("Product Name is required");
    if (!productDescription) errorMessage.push("Product Description is required");
    if (!productDetails) errorMessage.push("Product Details is required");

    // If there are any missing fields, return an error
    if (errorMessage.length > 0) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path));
        }
        return res.status(400).json({ errors: errorMessage });
    }

    // Check if product name already exists
    const existingProduct = await Product.findOne({
        productName: { $regex: `^${productName.trim()}$`, $options: 'i' } // Case-insensitive check
    });

    if (existingProduct) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path)); // Cleanup uploaded files if product name is not unique
        }
        return res.status(400).json({ message: 'Product with this name already exists' });
    }

    // If no images are uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "Product Images are required" });
    }

    // Check and parse Variant if it's a string (JSON string)
    let parsedVariant = [];
    try {
        parsedVariant = Array.isArray(Variant) ? Variant : JSON.parse(Variant); // Parse if it's a string
    } catch (error) {
        return res.status(400).json({ message: "Invalid Variant data" });
    }
    let recommendedIds = [];

    if (req.body?.recommendedProductId) {
        try {
            recommendedIds = JSON.parse(req.body?.recommendedProductId).filter(id => id && id.trim() !== "");
        } catch (e) {
            recommendedIds = [];
        }
    }

    const parseRecommendedProductId = recommendedIds?.map(id => new mongoose.Types.ObjectId(id));

    // Proceed with creating the product
    const productData = {
        // categoryName,
        // subcategoryName,
        // secondsubcategoryName,
        parentProductId,
        productName,
        productDescription,
        productDetails,
        ActiveonHome,
        ActiveonFlavours,
        FeaturedProducts,
        deliveryTo60Min,
        ActiveonDeliveryDate,
        NameOnCake,
        eggless,
        BestSellingProduct,
        recommendedProductId: parseRecommendedProductId,
        Variant: parsedVariant.map(variant => ({
            ...variant,
            // weight: variant.weight ? new mongoose.Types.ObjectId(variant.weight) : null,  // Handle empty weight
            // flover: variant.flover ? new mongoose.Types.ObjectId(variant.flover) : null   // Handle empty flover
        })),
        productImage: req.files.map(file => file.path), // Save paths to the uploaded images
    };
    try {
        const product = new Product(productData);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getProductsActiveonHome = async (req, res) => {
    try {
        const products = await Product.find({ ActiveonHome: 1 })
            .sort({ createdAt: -1 })
            // .populate('categoryName')
            // .populate('subcategoryName')
            // .populate('secondsubcategoryName')
            .populate('recommendedProductId')
            .populate('parentProductId')
            // .populate({
            //     path: 'Variant.weight',
            //     model: 'Size',
            // })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ FeaturedProducts: 1 })
            .sort({ createdAt: -1 })
            // .populate('categoryName')
            // .populate('subcategoryName')
            // .populate('secondsubcategoryName')
            .populate('recommendedProductId')
            // .populate({
            //     path: 'Variant.weight',
            //     model: 'Size',
            // })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getBestSellingProducts = async (req, res) => {
    try {
        const products = await Product.find({ BestSellingProduct: 1 })
            .sort({ createdAt: -1 })
            // .populate('categoryName')
            // .populate('subcategoryName')
            // .populate('secondsubcategoryName')
            .populate('recommendedProductId')
            // .populate({
            //     path: 'Variant.weight',
            //     model: 'Size',
            // })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Read Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
            // .populate('categoryName')
            // .populate('subcategoryName')
            // .populate('secondsubcategoryName')
            .populate('recommendedProductId')
            .populate('parentProductId')
            // .populate({
            //     path: 'Variant.weight',
            //     model: 'Size',
            // })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        // console.log("ParentProductParentProduct=>>", products[0])
        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Product
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
            .sort({ createdAt: -1 })
            // .populate('categoryName')
            // .populate('subcategoryName')
            // .populate('secondsubcategoryName')
            .populate('recommendedProductId')
            .populate('parentProductId')
            // .populate('Variant.weight')
            .populate('Variant.flover');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Single Product
const getProductByname = async (req, res) => {
    const { name } = req.params;
    try {
        const product = await Product.findOne({ productName: name })
        // .populate('categoryName')
            .sort({ createdAt: -1 })
            // .populate('subcategoryName')
            // .populate('secondsubcategoryName')
            .populate('recommendedProductId')
            // .populate('Variant.weight')
            .populate('Variant.flover');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Products By Subcategory Name
const getProductsBySubcategory = async (req, res) => {
    const { subcategoryName } = req.params;  // Expecting a single subcategory name
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            // .populate('categoryName')
            // .populate('subcategoryName')
            // .populate('secondsubcategoryName')
            .populate('recommendedProductId')

        const filterProductData = products.filter((x) => x.subcategoryName.subcategoryName === subcategoryName)
        if (!filterProductData || filterProductData.length === 0) {
            return res.status(404).json({ message: 'No products found for the provided subcategory' });
        }

        res.status(200).json({ data: filterProductData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductsBySubcategoryId = async (req, res) => {
    const { id } = req.params;

    try {
        const products = await Product.find({
            $or: [
                { categoryName: id },          // main category
                { subcategoryName: id },       // subcategory
                { secondsubcategoryName: id }, // second subcategory
            ]
        }).sort({ createdAt: -1 })
        // .populate("categoryName")
        // .populate("subcategoryName")
        // .populate("secondsubcategoryName")
        .populate("recommendedProductId");


        res.status(200).json({ data: products });

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log('ddddd-->', req.body)
    // Collect updated data from the request body
    const updatedData = {
        // categoryName: req.body.categoryName,
        // subcategoryName: req.body.subcategoryName,
        // secondsubcategoryName: req.body.secondsubcategoryName,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productDetails: req.body.productDetails,
        parentProductId: req.body.parentProductId,
        ActiveonHome: req.body.ActiveonHome || 0, // Default to 0 if not provided
        ActiveonFlavours: req.body.ActiveonFlavours || 0,
        FeaturedProducts: req.body.FeaturedProducts || 0,
        NameOnCake: req.body.NameOnCake || 0,
        eggless: req.body.eggless || 0,
        ActiveonDeliveryDate: req.body.ActiveonDeliveryDate || 0,
        deliveryTo60Min: req.body.deliveryTo60Min || 0,
        BestSellingProduct: req.body.BestSellingProduct || 0,
        recommendedProductId: req.body.recommendedProductId ? JSON.parse(req.body.recommendedProductId) : [],
        Variant: req.body.Variant ? JSON.parse(req.body.Variant) : [], // Parse Variant if provided, default to empty array
    };

    // If new images are uploaded, add them to the updated data
    if (req.files && req.files.length > 0) {
        updatedData.productImage = req.files.map(file => file.path);
    }

    try {
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product name is unique (to avoid updating to an existing product name)
        if (req.body.productName && req.body.productName !== product.productName) {
            const existingProduct = await Product.findOne({
                productName: { $regex: `^${req.body.productName.trim()}$`, $options: 'i' }, // Case-insensitive check
            });

            if (existingProduct) {
                return res.status(400).json({ message: 'Product with this name already exists' });
            }
        }

        // If new images are provided, delete the old ones
        if (req.files && req.files.length > 0) {
            product.productImage.forEach((imagePath) => {
                deleteImageFile(imagePath); // Delete old images from file storage
            });
        }

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        // Return the updated product data in the response
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
        console.error(err);

        // Handle specific errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error: err.message });
        }

        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID', error: err.message });
        }

        // Generic server error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images using the deleteImageFile function
        product.productImage.forEach((imagePath) => {
            deleteImageFile(imagePath); // Use deleteImageFile here
        });

        // Delete the product from the database
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { productId, isActive, type } = req.body;
        let updatedStatus = '';

        if (type === 'ActiveonHome') {

            updatedStatus = await Product.findByIdAndUpdate(productId, { ActiveonHome: isActive }, { new: true });
        }
        if (type === 'BestSellingProduct') {
            updatedStatus = await Product.findByIdAndUpdate(productId, { BestSellingProduct: isActive }, { new: true });
        }
        if (type === 'FeaturedProducts') {
            updatedStatus = await Product.findByIdAndUpdate(productId, { FeaturedProducts: isActive }, { new: true });
        }
        if (type === 'deliveryTo60Min') {
            updatedStatus = await Product.findByIdAndUpdate(productId, { deliveryTo60Min: isActive }, { new: true });
        }

        console.log("RES=>", updatedStatus);
        return res.status(200).json({ status: true, message: "Product status updated successfully", data: updatedStatus, });
    } catch (err) {
        console.error("Error updating product status:", err);
        return res.status(500).json({ status: false, message: "Server error while updating product status", });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductsBySubcategoryId,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductByname,
    getProductsBySubcategory,
    getProductsActiveonHome,
    getFeaturedProducts,
    getBestSellingProducts,
    changeStatus
};
