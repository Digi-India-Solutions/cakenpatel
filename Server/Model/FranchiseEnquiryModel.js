const mongoose = require("mongoose");

const FranchiseEnquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        message: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "inProgress", "resolved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const FranchiseEnquiry = mongoose.model("FranchiseEnquiry", FranchiseEnquirySchema);
module.exports = FranchiseEnquiry;