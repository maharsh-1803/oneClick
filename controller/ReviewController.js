const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const ReviewSchema = require("../model/ReviewSchema");
const UserSchema = require('../model/UserSchema')
const jwt = require("jsonwebtoken");

module.exports = class ReviewController extends BaseController {
  
  async insert(req, res) {
    try {
      const tokenData = req.userdata;

      const data = {
        userId: tokenData.id,
        detail: req.body.detail,
        startupId: req.body.startupId,
        stars: req.body.stars,
        productId: req.body.productId,
      };

      var reviewData = new ReviewSchema(data);

      const newReview = await reviewData.save();

      return this.sendJSONResponse(
        res,
        "data saved",
        {
          length: 1,
        },
        newReview
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async review_edit(req, res) {
    try {
      const tokenData = req.userdata;
      const review_id = req.query.review_id;
  
      const updatedReview = await ReviewSchema.findOneAndUpdate(
        {  _id: review_id },
        req.body,
        { new: true } 
      );
  
      if (!updatedReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Updated data",
        data: {
          length: 1,
          review: updatedReview,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  }
  

  async review_delete(req, res) {
    try {
      const tokenData = req.userdata;

      const review_id = req.query.review_id;

      const newReview = await ReviewSchema.findByIdAndDelete({
        _id: review_id,
      });

      return this.sendJSONResponse(
        res,
        "Review deleted",
        {
          length: 1,
        },
        newReview
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

      const allReview = await ReviewSchema.find({ userId: tokenData.id });

      return this.sendJSONResponse(
        res,
        "All Reviews",
        {
          length: 1,
        },
        allReview
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
 
  async getReviewbyproductId(req, res) {
    try {
        const { id } = req.params;
        const reviews = await ReviewSchema.find({ productId: id });

        if (reviews.length > 0) {
            const userIds = reviews.map(review => review.userId);
            const users = await UserSchema.find({ _id: { $in: userIds } });
            const userIdToUsernameMap = {};
            const baseURL = "https://oneclick-sfu6.onrender.com/user";

            users.forEach(user => {
                userIdToUsernameMap[user._id.toString()] = {
                    name: user.name,
                    profilePicture: user.profilePicture ? `${baseURL}/${user.profilePicture}` : null
                };
            });

            const reviewsWithUsernames = reviews.map(review => ({
                _id: review._id,
                stars: review.stars,
                userId: review.userId,
                name: userIdToUsernameMap[review.userId.toString()].name || 'Unknown',
                profilePicture: userIdToUsernameMap[review.userId.toString()].profilePicture || 'Unknown',
                detail: review.detail,
                productId: review.productId,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt
            }));

            return res.status(200).json({
                message: "Reviews retrieved successfully",
                reviews: reviewsWithUsernames
            });
        } else {
            return res.status(404).json({
                message: "No reviews found for the given product ID"
            });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
}
