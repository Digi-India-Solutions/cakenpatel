const mongoose = require("mongoose")

const SubCategorySchema = new mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    image: {
        type: String,
    },
    banner: {
        type: String
    },
    subcategoryName: {
        type: String,
        required: true
    },
    ActiveonHome: {
        type: Boolean,
        default: false
    },
    ActiveonHeader: {
        type: Boolean,
        default: false
    },
    innersubcategoryExit: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Subcategory = mongoose.model("Subcategory", SubCategorySchema)

module.exports = Subcategory