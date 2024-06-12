const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    startupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'startup',
        require:true
    },
    partner_photo:{
        type:String,
        require:true
    },
    position:{
        type:String,
        require:true
    },
    partner_name:{
        type:String,
        require:true
    },
    DOB:{
        type:Date,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
    country:{
        type:String,
        require:true
    }
})

const Partner = mongoose.model('Partner',PartnerSchema);
module.model =Partner;