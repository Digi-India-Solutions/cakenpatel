const ParentProduct = require("../Model/ParentProductModel");


// ============================================================
// ✅ CREATE
// ============================================================
const createParentProduct = async (req, res) => {
  try {
    const { parentProductName, ActiveonHome } = req.body;

    if (!parentProductName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Parent product name is required.",
      });
    }

    const normalizedName = parentProductName.trim().toLowerCase();

    // ✅ duplicate check (case-insensitive)
    const existing = await ParentProduct.findOne({
      parentProductName: { $regex: `^${normalizedName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Parent product name already exists.",
      });
    }

    const newCategory = await ParentProduct.create({
      parentProductName: normalizedName,
      ActiveonHome: !!ActiveonHome,
    });

    return res.status(201).json({
      success: true,
      message: "Parent Product created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Create Parent Product error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating parent product",
    });
  }
};


// ============================================================
// ✅ UPDATE
// ============================================================
const updateParentProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { parentProductName, ActiveonHome } = req.body;

    const category = await ParentProduct.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Parent Product not found",
      });
    }

    // ✅ name update
    if (parentProductName?.trim()) {
      const normalizedName = parentProductName.trim().toLowerCase();

      const existing = await ParentProduct.findOne({
        parentProductName: { $regex: `^${normalizedName}$`, $options: "i" },
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Parent product name already exists.",
        });
      }

      category.parentProductName = normalizedName;
    }

    // ✅ boolean safe update
    if (typeof ActiveonHome === "boolean") {
      category.ActiveonHome = ActiveonHome;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Parent Product updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update Parent Product error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating parent product",
    });
  }
};


// ============================================================
// ✅ DELETE
// ============================================================
const deleteParentProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ParentProduct.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Parent Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parent Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Parent Product error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting parent product",
    });
  }
};


// ============================================================
// ✅ GET ALL
// ============================================================
const getAllParentProduct = async (req, res) => {
  try {
    const categories = await ParentProduct.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Parent Products retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get all Parent Product error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving parent products",
    });
  }
};


// ============================================================
// ✅ GET ACTIVE ON HOME
// ============================================================
const getAllParentProductStatusTrue = async (req, res) => {
  try {
    const categories = await ParentProduct.find({
      ActiveonHome: true, // ✅ FIXED BUG
    });

    return res.status(200).json({
      success: true,
      message: "Active Parent Products retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get active Parent Product error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving parent products",
    });
  }
};


// ============================================================
// ✅ GET SINGLE BY ID
// ============================================================
const getSingleParentProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ParentProduct.findById(id); // ✅ FIXED

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Parent Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parent Product retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get single Parent Product error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving parent product",
    });
  }
};


// ============================================================
// ✅ GET BY NAME
// ============================================================
const getSingleParentProductByName = async (req, res) => {
  try {
    const { name } = req.params;

    const category = await ParentProduct.findOne({
      parentProductName: name.toLowerCase(),
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Parent Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parent Product retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get by name Parent Product error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving parent product",
    });
  }
};


module.exports = {
  createParentProduct,
  updateParentProduct,
  deleteParentProduct,
  getAllParentProduct,
  getSingleParentProduct,
  getAllParentProductStatusTrue,
  getSingleParentProductByName,
};