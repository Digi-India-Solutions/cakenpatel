const mongoose = require("mongoose");

const EventEnquirySchema = new mongoose.Schema(
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
        message: {
            type: String,
            trim: true,
            default: "",
        },
        enquiryType: {
            type: String,
            trim: true,
            default: "",
        },
        enquiryTitle: {
            type: String,
            trim: true,
            default: "",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "inProgress", "resolved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const EventEnquiry = mongoose.model("EventEnquiry", EventEnquirySchema);
module.exports = EventEnquiry;