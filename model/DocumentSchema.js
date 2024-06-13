const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    document_type:{
        type:String,
        require:true
    },
    document_photo:{
        type:String,
        require:true
    }
},{timestamps:true})

const Document = mongoose.model('Document',DocumentSchema);

module.exports=Document;