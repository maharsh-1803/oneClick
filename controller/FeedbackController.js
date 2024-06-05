const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const FeedbackSchema = require("../model/FeedbackSchema");
// const UserSchema = require("../model/UserSchema");
const jwt = require("jsonwebtoken");

module.exports = class FeedbackController extends BaseController {
  async insert(req, res) {
    try {
      const tokenData = req.userdata;

      const data = {
        userId: tokenData.id,
        feedbackType: req.body.feedbackType,
        feedbackDecription: req.body.feedbackDecription,
      };

      const feedbackData = new FeedbackSchema(data);

      const feedback = await feedbackData.save();

      return this.sendJSONResponse(
        res,
        "data saved",
        {
          length: 1,
        },
        feedback
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async display(req, res) {
    try {
      const tokenData = req.userdata;
      // const adminId = tokenData._id;

      const data = await FeedbackSchema.find({}).sort({ updatedAt: -1 });

      return this.sendJSONResponse(
        res,
        "All feedbacks",
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
};
