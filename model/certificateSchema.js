const mongoose = require("mongoose");

function getISTTime() {
  const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "startup",
    },
    certificateName: {
      type: String,
      required: true,
    },
    competitionName: {
      type: String,
      required: true,
    },
    certificateYear: {
      type: String,
      required: true,
    },
    certificatePlace: {
      type: String,
      required: true,
    },
    photos: {
      type: String,
      required: true,
      default:'https://oneclick-sfu6.onrender.com/certificate/images.jpeg'
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

const certificate = mongoose.model("certificate", certificateSchema);

module.exports = certificate;
