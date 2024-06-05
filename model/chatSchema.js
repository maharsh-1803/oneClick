const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    inquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "inquiry"
    },
    message: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,

    },
    datetime: {
        type: Date,
        default: Date.now
    },
    createdAt: { type: Date, default: Date.now }, // Add createdAt field with default value
    updatedAt: { type: Date, default: Date.now }, // Add updatedAt field with default value
});

module.exports = mongoose.model('chat', chatSchema)