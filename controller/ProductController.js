const BaseController = require("./BaseController");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const ProductSchema = require("../model/ProductSchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const { lookup } = require("dns");
// const product = require("../model/ProductSchema");

module.exports = class ProductController extends BaseController {

  async insert(req, res) {
    try {
      // const tokenData = req.userdata;

      const data = {
        startupId: req.body.startupId,
        categoryId: req.body.categoryId,
        subcategoryId: req.body.subcategoryId,
        productName: req.body.productName,
        description: req.body.description,
        productPhotos: req.files ? req.files.map((el) => el.filename) : [],
        productprice: req.body.productprice,
        productstatus: req.body.productstatus,
      };

      var productData = new ProductSchema(data);

      const newProduct = await productData.save();

      return this.sendJSONResponse(
        res,
        "data saved",
        {
          length: 1,
        },
        newProduct
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async product_edit(req, res) {
    try {
      const tokenData = req.userdata;

      const product_id = req.query.product_id;
      console.log("product_id", product_id);

      const product = await ProductSchema.findOne({ _id: product_id });

      if (!product) {
        return res.status(400).json({
          message: "Incorrect code",
        });
      }
      console.log("me");

      // if (product.photos && Array.isArray(product.photos)) {
      //   product.photos.forEach((el) => {
      //     const filePath = path.join(
      //       __dirname,
      //       "storage/images/product/",
      //       el
      //     );
      //     if (fs.existsSync(filePath)) {
      //       fs.unlinkSync(filePath);
      //     }
      //   });
      // }

      const newProduct = await ProductSchema.updateOne(
        { _id: product_id },
        {
          $set: {
            startupId: req.body.startupId,
            categoryId: req.body.categoryId,
            subcategoryId: req.body.subcategoryId,
            productName: req.body.productName,
            description: req.body.description,
            productPhotos: req.files ? req.files.map((el) => el.filename) : [],
            productprice: req.body.productprice,
            productstatus: req.body.productstatus,

          },
        }
      );

      return this.sendJSONResponse(
        res,
        "Category updated",
        {
          length: 1,
        },
        newProduct
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async product_delete(req, res) {
    try {
      const tokenData = req.userdata;
      const product_id = req.query.product_id;

      const product = await ProductSchema.findOne({ _id: product_id });

      if (!product) {
        return res.status(400).json({
          message: "Incorrect code",
        });
      }

      // if (product.photos && Array.isArray(product.photos)) {
      //   product.photos.forEach((el) => {
      //     const filePath = path.join(
      //       __dirname,
      //       "storage/images/product/",
      //       el
      //     );
      //     if (fs.existsSync(filePath)) {
      //       fs.unlinkSync(filePath);
      //     }
      //   });
      // }

      const newProduct = await ProductSchema.deleteOne({ _id: product_id });

      return this.sendJSONResponse(
        res,
        "Product deleted",
        {
          length: 1,
        },
        newProduct
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }



  async product_displaydetail(req, res) {
    try {
      const tokenData = req.userdata;
      const product_id = req.query.product_id;

      const product = await ProductSchema.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(product_id) } },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "productId",
            as: "reviews",
          },
        },
        {
          $lookup: {
            from: "startups",
            localField: "startupId",
            foreignField: "_id",
            as: "startup",
          },
        },
        {
          $unwind: {
            path: "$startup",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "startup.categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "startup.subcategoryId",
            foreignField: "_id",
            as: "subcategory",
          },
        },
        {
          $lookup: {
            from: "inqubationcenters",
            localField: "startup.inqubationCenterId",
            foreignField: "_id",
            as: "incubationCenter",
          },
        },
        {
          $lookup: {
            from: "products",
            let: { startupId: "$startupId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$startupId", "$startupId"] },
                      { $ne: ["$_id", mongoose.Types.ObjectId(product_id)] },
                    ],
                  },
                },
              },
            ],
            as: "otherProducts",
          },
        },
        {
          $lookup: {
            from: "partners",
            localField: "startup._id",
            foreignField: "startupId",
            as: "partners",
          },
        },
        {
          $project: {
            _id: 1,
            productName: 1,
            description: 1,
            productPhotos: 1, // Make sure this field is projected correctly
            productprice: 1,
            productstatus: 1,
            createdAt: 1,
            updatedAt: 1,
            reviews: 1,
            startup: {
              _id: 1,
              userId: 1,
              startupName: 1,
              address: 1,
              contactNumber: 1,
              contactPerson: 1,
              email: 1,
              city: 1,
              state: 1,
              country: 1,
              inqubationCenterId: 1,
              inqubationCenterCity: 1,
              categoryId: 1,
              subcategoryId: 1,
              startupLogo: 1,
              yearOfEstablished: 1,
              registeredAs: 1,
              pincode: 1,
              createdAt: 1,
              updatedAt: 1,
              categoryName: { $arrayElemAt: ["$category.name", 0] },
              subcategoryName: { $arrayElemAt: ["$subcategory.name", 0] },
              incubationCenterName: { $arrayElemAt: ["$incubationCenter.IcName", 0] },
            },
            partners: 1,
            otherProducts: 1
          }
        }
      ]);

      if (!product || product.length === 0) {
        return res.status(400).json({
          message: "Incorrect code",
        });
      }

      const baseURL = 'https://oneclick-sfu6.onrender.com/product'; // Replace 'https://your-base-url.com' with your actual base URL
      product.forEach(product => {
        if (product.productPhotos) {
          product.productPhotos = product.productPhotos.map(photo => `${baseURL}/${photo}`);
        }
      });

      return this.sendJSONResponse(
        res,
        "Product",
        {
          length: 1,
        },
        product
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }



  //api for /home2 route on frontend
  async productdisplay_ByCategory(req, res) {
    try {
      const tokenData = req.userdata;
      const categoryId = req.query.categoryId;
      const subcategoryId = req.query.subcategoryId;

      const product = await ProductSchema.find({
        categoryId: categoryId,
        subcategoryId: subcategoryId,
      });
      return this.sendJSONResponse(
        res,
        "Product",
        {
          length: 1,
        },
        product
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }


  async productdisplay_By_sub_category(req, res) {
    try {
      const subcategory_id = req.query.subcategory_id;

      const allproduct = await ProductSchema.aggregate([
        {
          $match: { subcategoryId: mongoose.Types.ObjectId(subcategory_id) }
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
          $unwind: "$subcategory"
        },
        {
          $lookup: {
            from: "categories",
            localField: "subcategory.categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            shoesphotos: 1,
            productName: 1,
            description: 1,
            productprice: 1,
            subcategoryName: "$subcategory.name",
            categoryName: "$category.name"
          }
        }
      ]);

      const baseURL = 'https://oneclick-sfu6.onrender.com/product'; // Replace 'https://your-base-url.com' with your actual base URL
      allproduct.forEach(product => {
        if (product.shoesphotos) {
          product.shoesphotos = product.shoesphotos.map(photo => `${baseURL}/${photo}`);
        }
      });

      return this.sendJSONResponse(
        res,
        "subcategory by product",
        {
          length: allproduct.length,
        },
        allproduct
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }
  async productDisplayByStartupId(req, res) {
    const BASE_URL = 'https://oneclick-sfu6.onrender.com/product'; // Replace with your actual base URL

    try {
      const { id } = req.params;
      const products = await ProductSchema.find({ startupId: id });

      if (!products || products.length === 0) {
        return res.status(400).send({ message: "Product not found" });
      }

      const productData = products.map(product => ({
        id: product._id,
        startupId: product.startupId,
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId,
        productName: product.productName,
        description: product.description,
        productPhotos: product.productPhotos.map(photo => `${BASE_URL}/${photo}`),
        productprice: product.productprice,
        productstatus: product.productstatus,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      return res.status(200).json({
        message: "Product retrieved successfully",
        products: productData
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

}

