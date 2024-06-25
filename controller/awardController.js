const BaseController = require("./BaseController");
const NotFound = require("../errors/NotFound");
const awardSchema = require("../model/awardSchema");
const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = class UserController extends BaseController {
  
  async insert(req, res) {
    try {
      const tokenData = req.userdata;
      const data = {
        userId: tokenData.id,
        startupId: req.body.startupId,
        achievementName: req.body.achievementName,
        competitionName: req.body.competitionName,
        achievementYear: req.body.achievementYear,
        achievementPlace: req.body.achievementPlace,
        description: req.body.description,
        photos: req.file ? req.file.filename : "",
      };
      console.log(data);

      const awarddata = new awardSchema(data);
      const award = await awarddata.save();

      return this.sendJSONResponse(
        res,
        "award",
        {
          length: 1,
        },
        award
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async displaybasic(req, res) {
    try {
      const tokenData = req.userdata;
      // const adminId = tokenData._id;

      const data = await awardSchema
        .find({ userId: tokenData.id })
        .sort({ updatedAt: -1 });

      return this.sendJSONResponse(
        res,
        "All awards",
        {
          length: 1,
        },
        data
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
  async award_edit(req, res) {
    try {
      const tokenData = req.userdata;

      const award_id = req.query.award_id;

      const award = await awardSchema.findOne({ _id: award_id });

      if (!award) {
        return res.status(400).json({
          message: "Incorrect code",
        });
      }

      // const photoToDelete = award.photos;
      // fs.unlinkSync("./storage/images/award/" + photoToDelete);

      const newAward = await awardSchema.updateOne(
        { _id: award_id },
        {
          $set: {
            achievementName: req.body.achievementName,
            competitionName: req.body.competitionName,
            achievementYear: req.body.achievementYear,
            achievementPlace: req.body.achievementPlace,
            description: req.body.description,
            photos: req.file ? req.file.filename : "",
          },
        }
      );
      console.log(newAward);

      return this.sendJSONResponse(
        res,
        "award",
        {
          length: 1,
        },
        newAward
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async award_delete(req, res) {
    try {
      const tokenData = req.userdata;
      const award_id = req.query.award_id;

      const award = await awardSchema.findOne({ _id: award_id });

      if (!award) {
        return res.status(400).json({
          message: "Incorrect code",
        });
      }

      // const photosInfo = award.photos.forEach((el) => {
      //   fs.unlinkSync("./storage/images/award/" + el);
      // });

      const newAward = await awardSchema.findOneAndDelete({ _id: award_id });

      return this.sendJSONResponse(
        res,
        "award deleted successfully",
        {
          length: 1,
        },
        newAward
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
  async getAwardById(req, res) {
    try {
      const awardId = req.query.award_id;
      const award = await awardSchema.findOne({ _id: awardId });

      if (!award) {
        return res.status(404).json({
          message: "Award not found",
        });
      }

      const baseURL = "https://oneclick-sfu6.onrender.com/award";
        const result = {
            ...award.toObject(),
            photos: `${baseURL}/${award.photos}`
        };

      return this.sendJSONResponse(
        res,
        "Award",
        {
          length: 1,
        },
        result
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
};
