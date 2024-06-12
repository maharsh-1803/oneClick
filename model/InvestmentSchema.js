const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
    startupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'startup'
    },
    investment_amount:{
        type:Number,
        require:true
    },
    investor_name:{
        type:String,
        require:true
    },
    date_when_available:{
        type:Date,
        require:true
    },
    other_details:{
        type:String
    }

})

const Investment = mongoose.model('Investment',InvestmentSchema);

module.exports = Investment;