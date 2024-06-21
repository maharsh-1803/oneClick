const Document = require("../model/DocumentSchema");

exports.AddDocument = async (req, res) => {
    try {
        const tokenData = req.userdata;
        const { document_type } = req.body;
        const file = req.file.filename;

        if (!document_type || !file) {
            return res.status(400).send({ message: "all fields are required" });
        }

        const newDocument = new Document({
            userId: tokenData.id,
            document_photo: file,
            document_type
        })

        const document = await newDocument.save();
        return res.status(200).json({
            message: "document uploaded successfully",
            data: document
        })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

exports.EditDocument = async (req, res) => {
    try {
        const tokenData = req.userdata;
        const { document_type } = req.body;
        const file = req.file;

        const document = await Document.findOne({ userId: tokenData.id });
        if (!document) {
            return res.status(400).send({ message: "Document not found with this user ID" });
        }

        let updateDocument = {
            document_type,
            status: 'pending'
        };


        if (req.file) {
            updateDocument.document_photo = req.file.filename;
        }

        let updatedDocument = await Document.findOneAndUpdate(
            { userId: tokenData.id }, updateDocument, { new: true }
        );

        return res.status(200).send(updatedDocument);

    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

exports.getDocument = async(req,res)=>{
    try {
        const tokenData = req.userdata;
        const userId = tokenData.id;
        console.log(userId);
        const document = await Document.find({userId:userId})
        if(!document){
            return res.status(400).send({message:"no document available"})
        }

        const baseURL = "https://oneclick-sfu6.onrender.com/document";

        const result = document.map(document=>({

            ...document.toObject(), 
            document_photo: `${baseURL}/${document.document_photo}`
        }))

        

        return res.status(200).json({
            message:"Document retrive successfully",
            document:result
        })
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}