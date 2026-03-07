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
    bannerName: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: true
    },
    bannerType: {
        type: String,
        required: true
    },
    bannerStatus: {
        type: String,
        default: "False"
    }
}, { timestamps: true })


const Banner = mongoose.model("Banner", bannerSchema)

module.exports = Banner