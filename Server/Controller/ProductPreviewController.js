const ProductPreview = require("../Model/ProductPreviewModel");


// CREATE PRODUCT PREVIEW
exports.createProductPreview = async (req, res) => {
    try {

        const images = req.files ? req.files.map(file => file.filename) : [];

        const preview = new ProductPreview({
            userId: req.body.userId,
            productId: req.body.productId,
            previewImage: images,
            massege: req.body.massege,
            rating: req.body.rating || 0
        });

        const savedPreview = await preview.save();

        res.status(201).json({
            success: true,
            message: "Product Preview Created Successfully",
            data: savedPreview
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// GET ALL PREVIEWS

exports.getAllProductPreview = async (req, res) => {
    try {
        // Parse pagination params — defaults: page 1, limit 10
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const [previews, total] = await Promise.all([
            ProductPreview.find()
                .populate("userId", "name email")
                .populate("productId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ProductPreview.countDocuments(),
        ]);

        return res.status(200).json({
            success: true,
            data: previews,
            pagination: {
                total, page, limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// GET SINGLE PREVIEW
exports.getSingleProductPreview = async (req, res) => {
    try {
        const preview = await ProductPreview.findById(req.params.id).populate("userId", "name email").populate("productId");
        if (!preview) {
            return res.status(404).json({ success: false, message: "Preview not found" });
        }
        res.status(200).json({ success: true, data: preview });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// GET PREVIEW BY PRODUCT ID
exports.getPreviewByProductId = async (req, res) => {
    try {
        const reviews = await ProductPreview.find({
            productId: req.params.productId,
            isActive: true,
        }).populate("userId", "name").sort({ createdAt: -1 });

        // ✅ Calculate average rating
        const totalReviews = reviews.length;
        const averageRating =
            totalReviews > 0
                ? parseFloat(
                    (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
                )
                : 0;

        return res.status(200).json({
            success: true,
            data: {
                reviews,        // ✅ frontend: reviewRes.data.data.reviews
                totalReviews,   // ✅ frontend: reviewRes.data.data.totalReviews
                averageRating,  // ✅ frontend: reviewRes.data.data.averageRating
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// UPDATE PREVIEW
exports.updateProductPreview = async (req, res) => {
    try {
        const images = req.files ? req.files.map(file => file.filename) : undefined;
        const updateData = { massege: req.body.massege, rating: req.body.rating };

        if (images && images.length > 0) {
            updateData.previewImage = images;
        }

        const preview = await ProductPreview.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!preview) {
            return res.status(404).json({ success: false, message: "Preview not found" });
        }

        res.status(200).json({
            success: true, message: "Preview Updated Successfully", data: preview
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// DELETE PREVIEW
exports.deleteProductPreview = async (req, res) => {
    try {

        const preview = await ProductPreview.findByIdAndDelete(req.params.id);

        if (!preview) {
            return res.status(404).json({
                success: false,
                message: "Preview not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Preview Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// CHANGE STATUS
exports.changePreviewStatus = async (req, res) => {
    try {

        const { id, isActive } = req.body;

        const preview = await ProductPreview.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Status Updated Successfully",
            data: preview
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};