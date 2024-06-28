const mongoose = require("mongoose");
function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

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
}, {
    timestamps: {
      currentTime: () => getISTTime() 
    }
  }
);

const chat =  mongoose.model('chat', chatSchema)
module.exports = chat;