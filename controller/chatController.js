const mongoose = require("mongoose");
const Chat = require("../model/chatSchema")

exports.insertChat = async (req, res) => {
    try {
        const tokenData = req.userdata;

        let { inquiryId, message, receiverId, userId, screen } = req.body;

        if (screen === "user") {
            let data = new Chat({
                inquiryId,
                senderId: tokenData.id,
                message,
                receiverId
            });
            await data.save()
            return res.status(200).json({
                success: true,
                message: "Chat inserted successfully",
                data: data
            });
        } else {
            let startupData = new Chat({
                inquiryId,
                message,
                senderId: receiverId,
                receiverId: userId
            });
            await startupData.save()
            return res.status(200).json({
                success: true,
                message: "Chat inserted successfully",
                data: startupData
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
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
