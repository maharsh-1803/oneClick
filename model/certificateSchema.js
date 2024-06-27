const mongoose = require("mongoose");

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
    timestamps: true,
  }
);

const certificate = mongoose.model("certificate", certificateSchema);

module.exports = certificate;
