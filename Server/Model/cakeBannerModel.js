const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        required: true
    },
    secondsubcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "SecondSubcategory",
        required: true
    },
    titel: {
        type: String,
        required: true
    },
    bannerKey: {
        type: String,
        required: true
    },
    cakeBanner: {
        type: String,
        required: true
    },

    bannerStatus: {
        type: String,
        default: "False"
    }
}, { timestamps: true })


const Banner = mongoose.model("CakeBanner", bannerSchema)

module.exports = Banner