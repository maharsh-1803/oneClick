const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const SubcategorySchema = require("../model/SubcategorySchema");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mongoose = require("mongoose");

module.exports = class SubcategoryController extends BaseController {
  
  async subcategory_insert(req, res) {
    try {
        const payload = req.body;

        let imgUrl = "";

        if (req.file) {
            imgUrl = req.file.filename;
        }

        payload.subcategoryPhoto = imgUrl;

        const subcategoryData = new SubcategorySchema(payload);

        const newSubcategory = await subcategoryData.save();

        return this.sendJSONResponse(
            res,
            "Data saved",
            {
                length: 1,
            },
            newSubcategory
        );
    } catch (error) {
        return this.sendErrorResponse(req, res, error);
    }
}


  async display_by_id(req, res) {
    try {
      // const tokenData = req.userdata;

      const subcategory_id = req.query.subcategory_id;

      const subCategory = await SubcategorySchema.find({ _id: subcategory_id });

      if (!subCategory) {
        return res.status(400).json({
          message: "Incorrect id",
        });
      }

      const baseURL = "https://oneclick-sfu6.onrender.com/subcategory";

      const modifiedSubcategories = subCategory.map(subCategory => ({
        ...subCategory,
        subcategoryPhoto: `${baseURL}/${subCategory.subcategoryPhoto}`
    }));

      return this.sendJSONResponse(
        res,
        "Subcategory Information",
        {
          length: 1,
        },
        {subCategory:modifiedSubcategories}
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async subcategory_update(req, res) {
    try {
      // const tokenData = req.userdata;

      const subcategory_id = req.query.subcategory_id;

      var imgUrl = "";
      if (req.file) imgUrl = `${req.file.filename}`;

      req.body.subcategoryPhoto = imgUrl;

      const subCategory = await SubcategorySchema.findOne({
        _id: subcategory_id,
      });

      if (!subCategory) {
        return res.status(400).json({
          message: "Incorrect id",
        });
      }

      if (subCategory) {
        const photoInfo = subCategory.subcategoryPhoto;

        // if (photoInfo) {
        //   fs.unlinkSync("storage/images/subcategory/" + photoInfo);
        // }

        const newSubCategory = await SubcategorySchema.updateOne(
          { _id: subcategory_id },
          req.body
        );

        return this.sendJSONResponse(
          res,
          "Subcategory updated",
          {
            length: 1,
          },
          newSubCategory
        );
      }
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async subcategory_delete(req, res) {
    try {
      // const tokenData = req.userdata;

      const subcategory_id = req.query.subcategory_id;

      const subCategory = await SubcategorySchema.findOne({
        _id: subcategory_id,
      });

      if (!subCategory) {
        return res.status(400).json({
          message: "Incorrect name",
        });
      }

      const photoInfo = subCategory.subcategoryPhoto;

      // if (photoInfo) {
      //   fs.unlinkSync("storage/images/subcategory/" + photoInfo);
      // }

      const newSubCategory = await SubcategorySchema.deleteOne({
        _id: subcategory_id,
      });

      return this.sendJSONResponse(
        res,
        "Subcategory deleted",
        {
          length: 1,
        },
        newSubCategory
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async subcategory_display_all(req, res) {
    try {
        // Aggregating subcategories with their respective categories
        const allSubcategory = await SubcategorySchema.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
        ]);

        const baseURL = "https://oneclick-sfu6.onrender.com/subcategory";

        // Mapping subcategories to include the full URL for their photos
        const modifiedSubcategories = allSubcategory.map(subCategory => ({
            ...subCategory,
            subcategoryPhoto: `${baseURL}/${subCategory.subcategoryPhoto}`
        }));

        return this.sendJSONResponse(
            res,
            "All Subcategory",
            {
                length: modifiedSubcategories.length, // Set length to the number of subcategories
            },
            modifiedSubcategories // Directly return the modifiedSubcategories array
        );
    } catch (error) {
        return this.sendErrorResponse(req, res, error);
    }
}

  
  async subcategory_display_by_category(req, res) {
    try {
      const category_id = req.query.category_id;

      const subcategories = await SubcategorySchema.find({
        categoryId: category_id,
      });

      const baseURL = "https://oneclick-sfu6.onrender.com/subcategory";

      const modifiedSubcategories = subcategories.map(subCategory => ({
        ...subCategory,
        subcategoryPhoto: `${baseURL}/${subCategory.subcategoryPhoto}`
    }));

      return this.sendJSONResponse(
        res,
        "Subcategories by Category",
        {
          length: subcategories.length,
        },
        {subcategories:modifiedSubcategories}
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
};
