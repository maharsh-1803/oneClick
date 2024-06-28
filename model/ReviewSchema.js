const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const reviewschema = new mongoose.Schema({
    stars: {
        type: Number,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    detail: {
        type: String
    },

    startupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "startup",
    },

    productId: {
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },

}, {
    timestamps: {
      currentTime: () => getISTTime() 
    }
  }
)

const review = new mongoose.model('review', reviewschema);

module.exports = review;