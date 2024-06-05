const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "startup",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    best_time_to_connect: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'reject', 'cancel', 'done'],
      default: 'active'
    }
  },
  {
    timestamps: true,
  }
);

const inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = inquiry;
