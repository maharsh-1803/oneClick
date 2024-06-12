const mongoose = require('mongoose');

const EducationSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    college_university_name:{
        type:String,
        require:ture
    },
    passing_year:{
        type:String,
        require:ture
    },
    highest_Education:{
        type:String,
        require:true
    }

});

const Education = mongoose.model('Education',EducationSchema);

module.exports=Education;