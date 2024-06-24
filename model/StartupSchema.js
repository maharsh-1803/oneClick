const mongoose = require("mongoose");

const startupschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    startupName: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          // Check if the value is a number and has at most 10 digits
          return /^\d{1,10}$/.test(value);
        },
        message: props => `${props.value} is not a valid contact number!`
      },
      unique: true,
    },

    contactPerson: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Regular expression for email validation
          return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: props => `${props.value} is not a valid email address!`
      },
      unique: true
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    inqubationCenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'inqubationcenter',
    },

    inqubationCenterCity: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcategory',
    },

    startupLogo: {
      type: String,
      required: true,
    },

    yearOfEstablished: {
      type: Date,
      required: true,
    },

    registeredAs: {
      type: String,
      required: true,
    },

    pincode: {
      type: Number,
      validate: {
        validator: function (value) {
          // Check if the value is a number and has at most 10 digits
          return /^\d{1,6}$/.test(value);
        },
        message: props => `${props.value} is not a valid pincode number!`
      },
    },

    status: {
      type: String,
      enum: ["active", "deactive", "block"],
    },
  },
  { timestamps: true }
);

const startup = new mongoose.model("startup", startupschema);

module.exports = startup;
