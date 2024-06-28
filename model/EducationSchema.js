const mongoose = require('mongoose');

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const EducationSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    college_university_name:{
        type:String,
    },
    passing_year:{
        type:Number,
    },
    highest_Education:{
        type:String,
    }

},{
    timestamps: {
      currentTime: () => getISTTime() 
    }
  });

const Education = mongoose.model('Education',EducationSchema);

module.exports = Education;