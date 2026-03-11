const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
    EventTitle: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ActiveonHome: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

const Event = mongoose.model("Event", EventSchema)

module.exports = Event