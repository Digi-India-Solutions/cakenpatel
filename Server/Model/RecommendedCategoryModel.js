const mongoose = require("mongoose")

const RecommendedCategorySchema = new mongoose.Schema({

    image: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    ActiveonHome: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

const RecommendedCategory = mongoose.model("RecommendedCategory", RecommendedCategorySchema)

module.exports = RecommendedCategory