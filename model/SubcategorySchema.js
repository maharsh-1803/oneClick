const mongoose = require("mongoose");

function getISTTime() {
    const istOffset = 5.5 * 60 *60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
  }

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    subcategoryPhoto: {
        type: String,
        // required: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }

}, {
    timestamps: {
      currentTime: () => getISTTime() 
    }
  })

const subcategory = new mongoose.model('subcategory', subCategorySchema);

module.exports = subcategory;