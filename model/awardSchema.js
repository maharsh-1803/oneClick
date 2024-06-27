const mongoose = require("mongoose");

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
      default:'../storage/images/award/images.jpeg'
      // required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const award = mongoose.model("award", awardSchema);

module.exports = award;
