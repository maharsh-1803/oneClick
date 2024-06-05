const mongoose = require("mongoose");

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

}, { timestamps: true })

const subcategory = new mongoose.model('subcategory', subCategorySchema);

module.exports = subcategory;