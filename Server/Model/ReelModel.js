

const mongoose = require("mongoose")

const reelSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  title: { type: String, },
  price: { type: String, },
  video: { type: String, required: true },
  activeOnHome: { type: Boolean, default: false },
},
  { timestamps: true })


const Reel = mongoose.model("Reel", reelSchema)

module.exports = Reel