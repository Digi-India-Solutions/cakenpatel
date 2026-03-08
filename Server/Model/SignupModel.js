const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field is must required"]
    },
    email: {
        type: String,
        required: [true, "email field is must required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "passowrd field is must required"]
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin", 'SuperAdmin']
    },
    otp: {
        type: Number
    },
    permissions: { type: Object, default: { dashboard: { read: true, write: true, update: true, delete: true }, } },
    referralCode: { type: String },        // unique code for user
    referredBy: { type: String },          // code used at signup
    walletBalance: { type: Number, default: 0 },

    isReferralRewardGiven: { type: Boolean, default: false }

}, { timestamps: true })

const user = mongoose.model("User", userSchema)
module.exports = user