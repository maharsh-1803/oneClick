const mongoose = require("mongoose");

const productschema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "startup",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productPhotos: {
      type: Array,
      required: true,
    },
    productprice: {
      type: String,
      required: true,
    },
    productstatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const product = new mongoose.model("product", productschema);

module.exports = product;
