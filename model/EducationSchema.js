const mongoose = require('mongoose');

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

},{timestamps:true});

const Education = mongoose.model('Education',EducationSchema);

module.exports = Education;