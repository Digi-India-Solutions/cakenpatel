const mongoose = require("mongoose")

const SecondSubCategorySchema = new mongoose.Schema({
    mainCategoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        required: true
    },
    productId: {
        type: Array,
        default: [],
        ref: "Product"

    },
    image: {
        type: String,
    },
    secondsubcategoryName: {
        type: String,
        required: true
    },
    secondName: {
        type: String
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

const Subcategory = mongoose.model("SecondSubcategory", SecondSubCategorySchema)

module.exports = Subcategory