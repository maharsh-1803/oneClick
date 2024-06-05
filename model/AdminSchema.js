const mongoose = require("mongoose");

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