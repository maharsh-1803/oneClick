const mongoose = require("mongoose");
const Chat = require("../model/chatSchema")
const { getReceiverSocketId, io, userSocketMap } = require("../socket/socket");


exports.insertChat = async (req, res) => {
    try {
        const tokenData = req.userdata;
        let { inquiryId, message, receiverId, userId, screen } = req.body;

        let chat;
        if (screen === "user") {
            chat = new Chat({
                inquiryId,
                senderId: tokenData.id,
                message,
                receiverId
            });
        } else {
            chat = new Chat({
                inquiryId,
                message,
                senderId: receiverId,
                receiverId: userId
            });
        }

        await chat.save();

        // io.emit('newMessage', chat); 
        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', chat);
        }

        const senderSocketId = getReceiverSocketId(tokenData.id);

        if (senderSocketId) {
            io.to(senderSocketId).emit('newMessage', chat);
        }

        return res.status(200).json({
            success: true,
            message: "Chat inserted successfully",
            data: chat
        });
    } catch (error) {
        console.error(error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        return res.status(400).send({error:error.message});
    }
};

exports.displayChatByInquiry = async (req, res) => {
    try {
        let inquiryId = req.query.inquiryId;
        if (!inquiryId) {
            return res.status(400).json({
                success: false,
                message: "Bad request: Inquiry ID is required"
            });
        }

        let data = await Chat.aggregate([
            {
                $match: { inquiryId: new mongoose.Types.ObjectId(inquiryId) }
            },
            {
                $lookup: {
                    from: "inquiries",
                    localField: "inquiryId",
                    foreignField: "_id",
                    as: "inquiryDetails"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Inquiry and Chat details found successfully",
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
