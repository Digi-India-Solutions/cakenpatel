const mongoose = require("mongoose");

const parentProductSchema = new mongoose.Schema(
  {
    parentProductName: {
      type: String,
      required: true,
      trim: true,
    },
    ActiveonHome: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ better model name (NO dash)
const ParentProduct = mongoose.model(
  "ParentProduct",
  parentProductSchema
);

module.exports = ParentProduct;