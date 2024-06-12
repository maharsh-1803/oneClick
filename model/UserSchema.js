const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },

    contact: {
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

    password: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true,
      maxlength: 300,
    },

    city: {
      type: String,
      required: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      maxlength: 100,
    },

    profilePicture: {
      type: String,
      default: "https://t3.ftcdn.net/jpg/03/64/62/36/240_F_364623624_eTeYrOr8oM08nsPPEmV8gGb60E0MK5vp.webp",
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
      enum: ["active", "deactive", "block", "pending"],
      default: "active",
    },
    DOB:{
      type:Date,
      require:true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
