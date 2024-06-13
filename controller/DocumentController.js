const Document = require("../model/DocumentSchema");

exports.AddDocument = async(req,res)=>{
    try {
        const tokenData = req.userdata;
        const {document_type} = req.body;
        const file = req.file.filename;

        if(!document_type || !file)
        {
            return res.status(400).send({message:"all fields are required"});
        }

        const newDocument = new Document({
            userId:tokenData.id,
            document_photo:file,
            document_type
        })

        const document = await newDocument.save();
        return res.status(200).json({
            message:"document uploaded successfully",
            data:document
        })
        
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

exports.EditDocument = async(req,res)=>{
    try {
        const {id} = req.params;
        const {document_type} = req.body;
        const file = req.file;

        const document = await Document.findById(id);
        if(!document)
        {
            return res.status(400).send({message:"document is not there with this id"})
        }

        let updateDocument = {
            document_type
        }

        if(req.file)
        {
            updateDocument.document_photo = req.file.filename;
        }

        let updatedDocument = await Document.findByIdAndUpdate(id,updateDocument,{new:true})

        return res.status(200).send(updatedDocument);
        
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}