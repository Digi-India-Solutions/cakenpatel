const mongoose = require("mongoose")

const ActiveOrderSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const ActiveOrder = mongoose.model("ActiveOrder", ActiveOrderSchema)

module.exports = ActiveOrder