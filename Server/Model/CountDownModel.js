const mongoose = require("mongoose");

const countdownSchema = new mongoose.Schema({
    title: String, // optional
    endTime: String, // countdown end time
    startTime: String, // countdown start time
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Main-Category" },
    isActive: { type: Boolean, default: true, },

}, { timestamps: true });

module.exports = mongoose.model("Countdown", countdownSchema);
