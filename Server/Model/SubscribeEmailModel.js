const mongoose = require("mongoose");

const SubscribeEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const SubscribeEmail = mongoose.model(
  "SubscribeEmail",
  SubscribeEmailSchema
);

module.exports = SubscribeEmail;
