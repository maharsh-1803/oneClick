const mongoose = require("mongoose");

function getISTTime() {
  const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const awardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "startup",
    },
    achievementName: {
      type: String,
      required: true,
    },
    competitionName: {
      type: String,
      required: true,
    },
    achievementYear: {
      type: String,
      required: true,
    },
    achievementPlace: {
      type: String,
      required: true,
    },
    photos: {
      type: String,
      default:'https://oneclick-sfu6.onrender.com/award/images.jpeg'
      // required: true,
    },
    description: {
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

const award = mongoose.model("award", awardSchema);

module.exports = award;
