const MainCategory = require("../Model/MainCategoryModel");
const SecondSubcategory = require("../Model/SecondSubcategoryModel");
const Subcategory = require("../Model/SubcategoryModel");

// Create a new subcategory
const createSecondSubcategory = async (req, res) => {
    const { mainCategoryId, subCategoryId, productId,secondName, secondSubcategoryName, ActiveonHome, ActiveonHeader } = req.body;
    console.log("ActiveonHeader and ActiveonHome", ActiveonHeader, ActiveonHome)
    // Validate required fields
    if (!mainCategoryId) {
        return res.status(400).json({ success: false, message: "Category Name is required" });
    }
    if (!subCategoryId) {
        return res.status(400).json({ success: false, message: "Sub Category Name is required" });
    }
    // if (!req.file ) {
    //     return res.status(400).json({ success: false, message: "Image is required" });
    // }

    try {
        // Check if the category ID is valid
        const validCategory = await MainCategory.findById(mainCategoryId);
        if (!validCategory) {
            // Cleanup uploaded file if category ID is invalid
            if (req.file && ActiveonHome) {
                deleteImageFile(req?.file?.path); // Assuming you have a function to delete files
            }
            return res.status(404).json({ success: false, message: "Invalid Main Category Id" });
        }
        const validSubcategory = await Subcategory.findById(subCategoryId);
        if (!validSubcategory) {
            // Cleanup uploaded file if category ID is invalid
            if (req.file && ActiveonHome) {
                deleteImageFile(req?.file?.path); // Assuming you have a function to delete files
            }
            return res.status(404).json({ success: false, message: "Invalid Sub category Id" });
        }

        // Normalize the subcategory name for consistent comparison
        const normalizedSubcategoryName = secondSubcategoryName?.trim()?.toLowerCase();

        // Check if the subcategory name already exists under the same category
        const existingSubcategory = await SecondSubcategory.findOne({
            mainCategoryId,
            secondSubCategoryName: { $regex: `^${normalizedSubcategoryName}$`, $options: "i" }
        });

        if (existingSubcategory) {
            //    uploaded file if subcategory name already exists
            if (req.file && ActiveonHome) {
                deleteImageFile(req?.file?.path);
            }
            return res.status(400).json({
                success: false,
                message: "Subcategory name already exists in this category"
            });
        }

        // Create the subcategory
        const subcategory = new SecondSubcategory({
            mainCategoryId,
            subCategoryId,
            secondName,
            productId: JSON.parse(productId),
            secondsubcategoryName: normalizedSubcategoryName,
            image: ActiveonHome ? req?.file?.path : null, // Save the path to the uploaded image
            ActiveonHome: ActiveonHome || false, // Default to false if not provided
            ActiveonHeader: ActiveonHeader || false
        });

        await subcategory.save();

        // Update the main category's subcategoryExit field to true
        validCategory.subcategoryExit = true;
        await validCategory.save();

        res.status(201).json({ success: true, message: "Subcategory created successfully", data: subcategory });
    } catch (error) {
        // Cleanup uploaded file if an error occurs
        if (req.file && ActiveonHome) {
            deleteImageFile(req?.file?.path);
        }

        console.error("Error creating subcategory:", error);

        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation error", error: error.message });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid category ID", error: error.message });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: "Error creating subcategory",
            error: error.message
        });
    }
};

// Get all subcategories
const getAllSecondSubcategories = async (req, res) => {
    try {
        const subcategories = await SecondSubcategory.find().populate("mainCategoryId").populate("subCategoryId");
        res.status(200).json({ data: subcategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

// Get all subcategories
const getAllSecondSubcategoriesStatusTrue = async (req, res) => {
    try {
        // Fetch subcategories where ActiveonHome is true
        const subcategories = await Subcategory.find({ ActiveonHome: true }).populate("categoryName");

        // If no subcategories are found, return a 404 response
        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active subcategories found"
            });
        }

        // Return the subcategories in the response
        res.status(200).json({
            success: true,
            message: "Active subcategories fetched successfully",
            data: subcategories
        });
    } catch (error) {
        console.error("Error fetching subcategories:", error);

        // Handle specific errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid query parameters",
                error: error.message
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: "Error fetching subcategories",
            error: error.message
        });
    }
};

// Get a single subcategory by ID
const getSecondSubcategoryById = async (req, res) => {
    try {
        const subcategory = await SecondSubcategory.findById(req.params.id).populate("mainCategoryId").populate("subCategoryId").populate("productId");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
};

const getSecondSubcategoryByName = async (req, res) => {
    try {
        const subcategory = await Subcategory.findOne({ subcategoryName: req.params.name }).populate("categoryName");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
};

// Update a subcategory by ID and delete the old image if a new one is provided
const updateSecondSubcategory = async (req, res) => {
    const { mainCategoryId, subCategoryId, productId,secondName, secondsubcategoryName, ActiveonHome, ActiveonHeader } = req.body;
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        const subcategory = await SecondSubcategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({ success: false, message: "Second subcategory not found" });
        }

        // Normalize name
        const normalizedName = secondsubcategoryName?.trim().toLowerCase();

        // 🔍 Duplicate check inside same main + sub category
        if (normalizedName) {
            const duplicate = await SecondSubcategory.findOne({
                _id: { $ne: id },
                mainCategoryId: mainCategoryId || subcategory.mainCategoryId,
                subCategoryId: subCategoryId || subcategory.subCategoryId,
                secondsubcategoryName: { $regex: `^${normalizedName}$`, $options: "i" },

            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Second subcategory already exists in this category",
                });
            }
        }

        // ✏ Update fields safely
        if (mainCategoryId) subcategory.mainCategoryId = mainCategoryId;
        if (subCategoryId) subcategory.subCategoryId = subCategoryId;
        if (normalizedName) subcategory.secondsubcategoryName = normalizedName;
        if (ActiveonHome) subcategory.ActiveonHome = ActiveonHome;
        if (ActiveonHeader) subcategory.ActiveonHeader = ActiveonHeader;
        if (productId) subcategory.productId = JSON.parse(productId);
        if (secondName) subcategory.secondName = secondName;

        // 🖼 Image update
        if (req.file && ActiveonHome) {
            if (subcategory.image) {
                try {
                    deleteImageFile(subcategory.image); // optional safe delete
                } catch (err) {
                    console.warn("Old image delete failed:", err.message);
                }
            }
            subcategory.image = req.file.path;
        }

        await subcategory.save();

        res.status(200).json({
            success: true,
            message: "Second subcategory updated successfully",
            data: subcategory,
        });

    } catch (error) {
        console.error("Update error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid ID" });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


const deleteImageFile = (filePath) => {
    const fs = require('fs');
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        }
    });
};

// Delete a subcategory by ID and delete the associated image
const deleteSecondSubcategory = async (req, res) => {
    try {
        const subcategory = await SecondSubcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Error deleting subcategory", error });
    }
};

const getActiveSecondSubcategories = async (req, res) => {
    try {
        // Fetch subcategories where ActiveonHome is true
        const activeSubcategories = await SecondSubcategory.find({ ActiveonHome: true })
            .populate('categoryName'); // Optionally populate the category details

        // If no active subcategories are found, return a 404 response
        if (!activeSubcategories || activeSubcategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active subcategories found",
            });
        }

        // Return the active subcategories in the response
        res.status(200).json({
            success: true,
            message: "Active subcategories fetched successfully",
            data: activeSubcategories,
        });
    } catch (error) {
        console.error("Error fetching active subcategories:", error);

        // Handle specific errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid query parameters",
                error: error.message,
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: "Error fetching active subcategories",
            error: error.message,
        });
    }
};

const getSecondSubcategoryBySubcategory = async (req, res) => {
    try {
        const subcategory = await SecondSubcategory.find({ subCategoryId: req.params.id }).populate("mainCategoryId").populate("subCategoryId");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
}
// Export all controller functions
module.exports = {
    createSecondSubcategory,
    getAllSecondSubcategories,
    getSecondSubcategoryById,
    updateSecondSubcategory,
    deleteSecondSubcategory,
    getAllSecondSubcategoriesStatusTrue,
    getSecondSubcategoryByName,
    getActiveSecondSubcategories,
    getSecondSubcategoryBySubcategory
};
