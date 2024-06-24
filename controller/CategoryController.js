const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const CategorySchema = require("../model/CategorySchema");
const SubcategorySchema = require("../model/SubcategorySchema");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports = class CategoryController extends BaseController {
  
  async category_insert(req, res) {
    try {
      // const tokenData = req.userdata;

      const payload = req.body;

      var imgUrl = "";

      if (req.file) imgUrl = `${req.file.filename}`;

      payload.categoryPhoto = imgUrl;

      var categoryData = new CategorySchema(payload);

      const newCategory = await categoryData.save();

      return this.sendJSONResponse(
        res,
        "data saved",
        {
          length: 1,
        },
        newCategory
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async display_by_id(req, res) {
    try {
      const tokenData = req.userdata;

      const category_id = req.query.category_id;

      const category = await CategorySchema.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(category_id),
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "_id",
            foreignField: "categoryId",
            as: "subcategory",
          },
        },
      ]);

      return this.sendJSONResponse(
        res,
        "Category Information",
        {
          length: 1,
        },
        category
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async category_update(req, res) {
    try {
      const tokenData = req.userdata;

      const category_id = req.query.category_id;

      var imgUrl = "";
      if (req.file) imgUrl = `${req.file.filename}`;

      req.body.categoryPhoto = imgUrl;

      const category = await CategorySchema.findOne({ _id: category_id });

      if (!category) {
        return res.status(400).json({
          message: "Incorrect id",
        });
      }

      const photoInfo = category.categoryPhoto;

      // if (photoInfo) {
      //   fs.unlinkSync("storage/images/category/" + photoInfo);
      // }

      const newCategory = await CategorySchema.updateOne(
        { _id: category_id },
        req.body
      );

      return this.sendJSONResponse(
        res,
        "Category updated",
        {
          length: 1,
        },
        newCategory
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async category_delete(req, res) {
    try {
      const tokenData = req.userdata;

      const category_id = req.query.category_id;

      const category = await CategorySchema.findOne({ _id: category_id });

      if (!category) {
        return res.status(400).json({
          message: "Incorrect name",
        });
      }

      const photoInfo = category.categoryPhoto;

      // if (photoInfo) {
      //   fs.unlinkSync("storage/images/category/" + photoInfo);
      // }

      const newCategory = await CategorySchema.deleteOne({ _id: category_id });

      return this.sendJSONResponse(
        res,
        "Category deleted",
        {
          length: 1,
        },
        newCategory
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async category_display_all(req, res) {
    try {
        const allCategory = await CategorySchema.find();
        const baseURL = "https://oneclick-sfu6.onrender.com/category";

        const modifiedCategories = allCategory.map(category => ({
            ...category.toObject(),
            categoryPhoto: `${baseURL}/${category.categoryPhoto}`
        }));

        return this.sendJSONResponse(
            res,
            "All Category",
            {
                length: modifiedCategories.length,  // Set length to the number of categories
            },
            // modifiedCategories  // Directly return the modifiedCategories array
            allCategory
        );
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        }
        return this.sendErrorResponse(req, res, error);
    }
}

  async category_display_all_withoutAuth(req, res) {
    try {
      const allCategory = await CategorySchema.find({});
      const allSubcategory = await SubcategorySchema.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$category", "$$ROOT"],
            },
          },
        },
        {
          $addFields: {
            categoryName: "$category.name",
          },
        },
        {
          $project: {
            category: 0,
          },
        },
      ]);
      const baseURLCategory = "https://oneclick-sfu6.onrender.com/category";

      const modifiedCategories = allCategory.map(category => ({
        ...category.toObject(),
        categoryPhoto: `${baseURLCategory}/${category.categoryPhoto}`
    }));

      const baseURLsubCategory = "https://oneclick-sfu6.onrender.com/subcategory";

      const modifiedSubCategories = allSubcategory.map(subcategory=>({
        ...subcategory.toObject(),
        subcategoryPhoto:`${baseURLsubCategory}/${subcategory.subcategoryPhoto}`
      }))

      return this.sendJSONResponse(
        res,
        "All Category and Subcategory",
        {
          length: 1,
        },
        {
          allCategory,
          allSubcategory
        }
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
};
