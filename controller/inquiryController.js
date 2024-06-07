const BaseController = require("./BaseController");
const NotFound = require("../errors/NotFound");
const inquirySchema = require("../model/inquirySchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = class UserController extends BaseController {

  async insert(req, res) {
    try {
      const tokenData = req.userdata;
      const data = {
        userId: tokenData.id,
        productId: req.body.productId,
        startupId: req.body.startupId,
        title: req.body.title,
        description: req.body.description,
        best_time_to_connect: req.body.best_time_to_connect,
      };
      console.log(req.body);

      const inquirydata = new inquirySchema(data);
      const inquiry = await inquirydata.save();

      return this.sendJSONResponse(
        res,
        "inquiry",
        {
          length: 1,
        },
        inquiry
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async buying_inquiry(req, res) {
    try {
      const tokenData = req.userdata;
      const data = {
        userId: tokenData.id,
        productId: req.body.productId,
        sellerId: req.body.sellerId, //in collection of startup, there is a field of userId
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        productname: req.body.productname,
        country: req.body.country,
        state: req.body.state,
        address: req.body.address,
        permanentaddress: req.body.permanentaddress,
        quantity: req.body.quantity,
      };

      const inquirydata = new inquirySchema(data);
      const buyinginquiry = await inquirydata.save();

      return this.sendJSONResponse(
        res,
        "All inquiries",
        {
          length: 1,
        },
        buyinginquiry
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async selling_inquiry(req, res) {
    try {
      const tokenData = req.userdata;
      const userId = tokenData.id;

      let { startupId } = req.body

      const inquiries = await inquirySchema.aggregate([
        {
          $match: {
            startupId: mongoose.Types.ObjectId(startupId),
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productData",
          },
        },
        {
          $unwind: "$productData",
        },
        {
          $lookup: {
            from: "startups",
            localField: "productData.startupId",
            foreignField: "_id",
            as: "startupData",
          },
        },
        {
          $unwind: "$startupData",
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $project: {
            "inquiryData": {
              "_id": "$_id",
              "title": "$title",
              "description": "$description",
              "best_time_to_connect": "$best_time_to_connect",
              "createdAt": "$createdAt",
              "updatedAt": "$updatedAt"
            },
            "productData": {
              "productName": "$productData.productName",
              "description": "$productData.description",
              "productprice": "$productData.productprice",
              "productcolor": "$productData.productcolor",
              "productstatus": "$productData.productstatus",
              "createdAt": "$productData.createdAt",
              "updatedAt": "$productData.updatedAt"
            },
            "startupData": {
              "startupName": "$startupData.startupName",
              "address": "$startupData.address",
              "contactNumber": "$startupData.contactNumber",
              "contactPerson": "$startupData.contactPerson",
              "email": "$startupData.email",
              "city": "$startupData.city",
              "state": "$startupData.state",
              "country": "$startupData.country",
              "inqubationCenterCity": "$startupData.inqubationCenterCity",
              "yearOfEstablished": "$startupData.yearOfEstablished",
              "registeredAs": "$startupData.registeredAs",
              "pincode": "$startupData.pincode",
              "createdAt": "$startupData.createdAt",
              "updatedAt": "$startupData.updatedAt"
            },
            "userData": {
              "name": "$userData.name",
              "contact": "$userData.contact",
              "email": "$userData.email",
              "address": "$userData.address",
              "city": "$userData.city",
              "state": "$userData.state",
              "pincode": "$userData.pincode",
              "status": "$userData.status",
              "createdAt": "$userData.createdAt",
              "updatedAt": "$userData.updatedAt",
              "__v": "$userData.__v"
            }
          }
        }
      ]);

      return this.sendJSONResponse(
        res,
        "Inquiries",
        {
          length: inquiries.length,
        },
        inquiries
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }


  async user_inquiry(req, res) {
    try {
      const tokenData = req.userdata;
      const userId = tokenData.id;

      const inquiries = await inquirySchema.aggregate([
        // {
        //   $match: {
        //     userId: new mongoose.Types.ObjectId(userId),
        //   },
        // },
        // {
        //   $lookup: {
        //     from: "products",
        //     localField: "productId",
        //     foreignField: "_id",
        //     as: "productDetails"
        //   }
        // },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "userId",
        //     foreignField: "_id",
        //     as: "userDetails"
        //   }
        // },
        // {
        //   $lookup: {
        //     from: "startups",
        //     localField: "productDetails.startupId",
        //     foreignField: "_id",
        //     as: "startupDetails"
        //   }
        // },
        // {
        //   $addFields: {
        //     "startupName": { $arrayElemAt: ["$startupDetails.startupName", 0] },


        //   }
        // }
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        {
          $unwind: "$productDetails"
        },
        {
          $lookup: {
            from: "startups",
            localField: "productDetails.startupId",
            foreignField: "_id",
            as: "startupDetails"
          }
        },
        {
          $unwind: "$startupDetails"
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $unwind: "$userDetails"
        },
        {
          $addFields: {
            "productName": "$productDetails.productName",
            "startupName": "$startupDetails.startupName"
          }
        },
      ]);

      console.log(inquiries)

      return this.sendJSONResponse(
        res,
        "inquiries",
        {
          length: 1,
        },
        inquiries
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }



  async updateStatus(req, res) {
    try {
      let inquiryId = req.query.inquiryId;
      const tokenData = req.userdata;
      const userId = tokenData.id;

      // Check if inquiryId is provided
      if (!inquiryId) {
        return res.status(400).json({
          success: false,
          message: "Inquiry ID is required"
        });
      }

      let data = {
        status: req.body.status
      };

      // Find the inquiry based on the inquiryId and userId
      let inquiry = await inquirySchema.findOne({ _id: inquiryId, userId: userId });

      // Check if the inquiry exists and if the user is authorized to update it
      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found or you are not authorized to update this inquiry"
        });
      }

      // Update the inquiry status
      let updateData = await inquirySchema.findOneAndUpdate(
        { _id: inquiryId },
        data,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Inquiry status updated successfully",
        data: updateData
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  }



}
