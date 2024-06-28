const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const inqubatoincenterschema = new mongoose.Schema({
    IcName: {
        type: String
    },

    IcCity: {
        type: String
    },

    IcState: {
        type: String
    },

    IcAddress: {
        type: String
    },

    IcContactNumber: {
        type: Number
    },

    IcContactPerson: {
        type: String
    },

    IcEmail: {
        type: String
    },

    pincode: {
        type: Number
    }

},{
    timestamps: {
      currentTime: () => getISTTime() 
    }
  })

const inqubationcenter = new mongoose.model('inqubationcenter', inqubatoincenterschema);

module.exports = inqubationcenter;