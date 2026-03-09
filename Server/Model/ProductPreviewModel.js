const mongoose = require("mongoose");

const ProductPreviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        previewImage: {
            type: [String],
            default: null
        },
        massege: {
            type: String
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },

    },

    { timestamps: true }
);

module.exports = mongoose.model("ProductPreview", ProductPreviewSchema);