const mongoose = require("mongoose");

function getISTTime() {
  const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const inquirySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
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
    timestamps: {
      currentTime: () => getISTTime() 
    }
  }
);

const inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = inquiry;
