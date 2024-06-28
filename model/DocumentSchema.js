const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const DocumentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    document_type: {
        type: String,
        require: true
    },
    document_photo: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ["approve", "decline", 'pending'],
        require:true
    }
}, {
    timestamps: {
      currentTime: () => getISTTime() 
    }
  }
)

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;