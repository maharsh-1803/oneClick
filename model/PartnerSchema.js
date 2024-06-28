const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const PartnerSchema = new mongoose.Schema({
    startupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'startup',
        require: true
    },
    partner_photo: {
        type: String,
        require: true
    },
    position: {
        type: String,
        require: true
    },
    partner_name: {
        type: String,
        require: true
    },
    DOB: {
        type: Date,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    }
}, {
    timestamps: {
      currentTime: () => getISTTime() 
    }
  })

const Partner = mongoose.model('Partner', PartnerSchema);
module.exports = Partner;