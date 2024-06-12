const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    document_type:{
        type:String,
        require:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    document_photo:{
        type:String,
        require:true
    }
})

const Document = mongoose.model('Document',DocumentSchema);

module.exports=Document;