const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const StartupSchema = require("../model/StartupSchema");
const categorySchema = require("../model/CategorySchema");
const subCategorySchema = require("../model/SubcategorySchema");
const inqubatoincenterschema = require("../model/InqubationcenterSchema");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mongoose = require("mongoose");
// const userSchema = require("../model/UserSchema")
const { constants } = require("crypto");

module.exports = class StartupController extends BaseController {

  async insert(req, res) {
    try {
      const tokenData = req.userdata;

      var imgUrl = "";

      if (req.file) imgUrl = `${req.file.filename}`;

      req.body.startupLogo = imgUrl || "";

      const data = {
        userId: tokenData.id,
        startupName: req.body.startupName,
        address: req.body.address,
        contactNumber: req.body.contactNumber,
        contactPerson: req.body.contactPerson,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        inqubationCenterId: req.body.inqubationCenterId,
        inqubationCenterCity: req.body.inqubationCenterCity,
        categoryId: req.body.categoryId,
        subcategoryId: req.body.subcategoryId,
        startupLogo: req.body.startupLogo,
        yearOfEstablished: req.body.yearOfEstablished,
        registeredAs: req.body.registeredAs,
        pincode: req.body.pincode,
      };

      const startupData = new StartupSchema(data);

      const startup = await startupData.save();

      return this.sendJSONResponse(
        res,
        "data saved",
        {
          length: 1,
        },
        startup
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }


  async displayBasic(req, res) {
    try {
      const tokenData = req.userdata;
      const userId = tokenData.id;

      // Find the startup by userId
      const startup = await StartupSchema.findOne({ userId });

      // Check if startup exists
      // if (!startup) {
      //   throw new NotFound("Startup not found");
      // }

      const data = await StartupSchema.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategory"
          }
        },
        {
          $lookup: {
            from: "inqubationcenters",
            localField: "inqubationCenterId",
            foreignField: "_id",
            as: "inqubation",
          },
        },
        {
          $addFields: {
            categoryName: { $arrayElemAt: ["$category.name", 0] },
            subcategoryName: { $arrayElemAt: ["$subcategory.name", 0] },
            inqubationcenterName: { $arrayElemAt: ["$inqubation.IcName", 0] }
          }
        }
      ]);

      // Define your base URL here
      const baseURL = "https://one-click-backend-1.onrender.com";

      // Map each startup data to include the full URL of the logo
      const basicData = data.map(startup => {
        return {
          ...startup,
          startupLogoURL: baseURL + "/" + startup.startupLogo // Assuming startupLogo contains only filename
        };
      });

      return this.sendJSONResponse(
        res,
        "Startup basic information",
        {
          length: basicData.length,
        },
        basicData
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }


  async displayDetail(req, res) {
    try {
      const tokenData = req.userdata;
      const startupId = req.query.startupId;

      const data = await StartupSchema.find({ _id: startupId });
      // console.log("data", data);

      console.log("tokenData", tokenData.id);

      let detailData;

      if (data.length !== 0) {
        detailData = await StartupSchema.aggregate([
          {
            $match: {
              _id: mongoose.Types.ObjectId(startupId),
            },
          },
          {
            $addFields: {
              categoryId: { $toObjectId: "$categoryId" },
              subcategoryId: { $toObjectId: "$subcategoryId" },
              inqubationCenterId: { $toObjectId: "$inqubationCenterId" },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $lookup: {
              from: "subcategories",
              localField: "subcategoryId",
              foreignField: "_id",
              as: "subcategory",
            },
          },
          {
            $lookup: {
              from: "inqubationcenters",
              localField: "inqubationCenterId",
              foreignField: "_id",
              as: "inqubation",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "startupId",
              as: "product",
              pipeline: [
                {
                  $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "productId",
                    as: "review",
                    pipeline: [
                      {
                        $lookup: {
                          from: "users",
                          localField: "userId",
                          foreignField: "_id",
                          as: "user",
                        },
                      },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                  },
                },
                {
                  $lookup: {
                    from: "subcategories",
                    localField: "subcategoryId",
                    foreignField: "_id",
                    as: "subcategory",
                  },
                },
                {
                  $addFields: {
                    categoryName: { $arrayElemAt: ["$category.name", 0] },
                    subcategoryName: { $arrayElemAt: ["$subcategory.name", 0] },
                  },
                },
                {
                  $unset: ["category", "subcategory"], // Remove categoryId and subcategoryId fields
                },
              ],
            },
          },
          {
            $lookup: {
              from: "certificates",
              localField: "_id",
              foreignField: "startupId",
              as: "certificate",
            },
          },
          {
            $lookup: {
              from: "awards",
              localField: "_id",
              foreignField: "startupId",
              as: "award",
            },
          },
        ]);
      }

      console.log("detailData", detailData);
      return this.sendJSONResponse(
        res,
        "Startup detail information",
        {
          length: 1,
        },
        detailData
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }



  async edit(req, res) {
    try {
      const tokenData = req.userdata;
      const startup_id = req.query.startup_id;

      const startup = await StartupSchema.findOne({ _id: startup_id });

      if (!startup) {
        return res.status(400).json({
          message: "Startup not found",
        });
      }

      // Update startup data
      const updateData = {
        startupName: req.body.startupName,
        description: req.body.description,
        address: req.body.address,
        contactNumber: req.body.contactNumber,
        contactPerson: req.body.contactPerson,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        inqubationCenterId: req.body.inqubationCenterId,
        categoryId: req.body.categoryId,
        subcategoryId: req.body.subcategoryId,
        yearOfEstablished: req.body.yearOfEstablished,
        registeredAs: req.body.registeredAs,
        pincode: req.body.pincode,
      };

      // Check if a file was uploaded
      if (req.file) {
        updateData.startupLogo = req.file.filename;
      }

      // Update the startup data in the database
      const updatedStartup = await StartupSchema.findByIdAndUpdate(
        startup_id,
        updateData,
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        message: "Startup data updated successfully",
        data: updatedStartup,
      });
    } catch (error) {
      console.error("Error updating startup:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }


  async display_by_filter(req, res) {
    try {
      const category_id = req.query.category_id;
      const subcategory_id = req.query.subcategory_id;

      const startup = await StartupSchema.find({
        categoryId: category_id,
        subcategoryId: subcategory_id,
      });

      return this.sendJSONResponse(
        res,
        "Updated data",
        {
          length: 1,
        },
        startup
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }



  async startup_delete(req, res) {
    try {
      // const tokenData = req.userdata;
      const startup_id = req.query.startup_id;

      const startup = await StartupSchema.findOne({
        _id: startup_id,
      });

      // if (!startup) {
      //   return res.status(400).json({
      //     message: "Incorrect code",
      //   });
      // }

      const deletestartup = await StartupSchema.deleteOne({ _id: startup_id });

      if (!deletestartup) {
        return res.status(401).json({
          success: false,
          message: "Startup Not Found!"
        });
      }

      return this.sendJSONResponse(
        res,
        "Deleted data",
        {
          length: 1,
        },
        deletestartup
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async displaycenterId(req, res) {
    try {
      const categories = await categorySchema.find();
      const subcategories = await subCategorySchema.find();
      const inqubationCenters = await inqubatoincenterschema.find();
      return this.sendJSONResponse(
        res,
        "Data found",
        {
          length: 1,
        },
        { categories, subcategories, inqubationCenters }
      );
    } catch (err) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
};
