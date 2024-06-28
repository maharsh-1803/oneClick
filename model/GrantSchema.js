const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

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
        type:Number,
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
},{
    timestamps: {
      currentTime: () => getISTTime() 
    }
  })

const Grant = mongoose.model('Grant',GrantSchema);

module.exports = Grant;