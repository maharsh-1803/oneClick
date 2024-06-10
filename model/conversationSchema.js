const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    inquiryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'inquiry',
        require:true
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user', 
            required: true
        }
    ],
},{timeseries:true})

const Convesation = mongoose.model('Conversation',conversationSchema);
module.exports = Convesation;