const mongoose = require("mongoose")

const pinCodeSchema = new mongoose.Schema(
    {
        stateName: {
            type: String,
            required: true,
            trim: true,
        },
        area: {
            type: String,
            required: true,
        },
        pinCode: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        deleveryStatus: {
            type: Boolean,
            default: false,
        },
        deleveryTime: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);


const PinCode = mongoose.model("PinCode", pinCodeSchema);

module.exports = PinCode