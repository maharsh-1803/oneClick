const mongoose = require("mongoose");

function getISTTime() {
  const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const feedbackschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    feedbackType: {
      type: String,
      required: true,
    },

    feedbackDecription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      currentTime: () => getISTTime() 
    }
  }
);

const feedback = new mongoose.model("feedback", feedbackschema);

module.exports = feedback;
