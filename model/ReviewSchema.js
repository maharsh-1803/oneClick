const mongoose = require("mongoose");

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

}, { timestamps: true })

const review = new mongoose.model('review', reviewschema);

module.exports = review;