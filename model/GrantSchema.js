const mongoose = require('mongoose');

const GrantSchema = new mongoose.Schema({
    startupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'startup',
        require:true
    },
    grant_name:{
        type:String,
        require:true
    },
    grant_amount:{
        type:String,
        require:true
    },
    date_when_available:{
        type:Date,
        require:true
    },
    grant_from:{
        type:String,
        require:true
    },
    other_details:{
        type:String
    }
})

const Grant = mongoose.model('Grant',GrantSchema);

module.exports = Grant;