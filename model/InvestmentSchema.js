const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

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

},{
    timestamps: {
      currentTime: () => getISTTime() 
    }
  })

const Investment = mongoose.model('Investment',InvestmentSchema);

module.exports = Investment;