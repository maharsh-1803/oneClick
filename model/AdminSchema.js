const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }

}, { timestamps: true })

const admin = new mongoose.model('admin', adminSchema);

module.exports = admin;