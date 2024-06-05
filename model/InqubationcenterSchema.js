const mongoose = require("mongoose");

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

},{timestamps: true})

const inqubationcenter = new mongoose.model('inqubationcenter', inqubatoincenterschema);

module.exports = inqubationcenter;