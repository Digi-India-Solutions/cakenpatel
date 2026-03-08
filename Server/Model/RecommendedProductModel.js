const mongoose = require("mongoose")

const recommendedProductSchema = new mongoose.Schema({
    recommendedCategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "RecommendedCategory",
        required: true
    },

    productName: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    productImage: {
        type: [String],
        required: true
    },
    ActiveonHome: {
        type: Boolean,
        default: 0
    },


})


const RecommendedProduct = mongoose.model("RecommendedProduct", recommendedProductSchema)

module.exports = RecommendedProduct