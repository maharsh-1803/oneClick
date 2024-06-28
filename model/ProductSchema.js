const mongoose = require("mongoose");

function getISTTime() {
  const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
  const now = new Date();
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

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
      default:['https://oneclick-sfu6.onrender.com/product/product.png']
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
  {
    timestamps: {
      currentTime: () => getISTTime() 
    }
  }
);

const product = new mongoose.model("product", productschema);

module.exports = product;
