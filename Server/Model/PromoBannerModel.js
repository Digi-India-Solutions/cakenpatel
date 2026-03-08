const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    bannerKey: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: String,
        default: "False"
    }
}, { timestamps: true })


const Promo = mongoose.model("PromoBanner", bannerSchema)

module.exports = Promo