const BaseController = require("./BaseController");
const NotFound = require("../errors/NotFound");
const UserSchema = require("../model/UserSchema");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mongoose = require('mongoose')

module.exports = class UserController extends BaseController {
  async postuser(req, res) {
    try {
      let userData = await UserSchema.findOne({ email: req.body.email });
      if (userData) {
        return res.status(400).json({
          success: false,
          message: "Email Already Exits!"
        })
      } else {
        const data = {
          name: req.body.userName,
          contact: req.body.contact,
          email: req.body.email,
          password: req.body.password,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
        };

        const userdata = new UserSchema(data);
        const user = await userdata.save();

        return this.sendJSONResponse(
          res,
          "data saved",
          {
            length: user.length,
          },
          user
        );
      }
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }


  
  //rakesh 
  async user_login(req, res) {
    try {
      const useremail = req.body.email;
      const password = req.body.password;

      const user = await UserSchema.find({
        email: useremail,
        password: password,
      });
      // console.log(user);

      if (user.length === 0) {
        throw new Forbidden("email id is not registered");
      }

      const required_data = {
        email: user[0].email,
        id: user[0]._id,
      };

      const token = jwt.sign(required_data, "asd", { expiresIn: "365d" });

      const result = {
        id: user[0]._id,
        token: token,
      };

      return this.sendJSONResponse(
        res,
        "successfully login",
        {
          length: 1,
        },
        result
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

 

  // async user_display(req, res) {
  //   try {
  //     const tokenData = req.userdata;

  //     const user = await UserSchema.find({ _id: tokenData.id });

  //     if (user.length === 0) {
  //       throw new Forbidden("You are not a user");
  //     }

  //     const user_data = await UserSchema.find({ _id: tokenData.id });
  //     // Define your base URL here
  //     const baseURL = "https://one-click-backend-mfrv.onrender.com/user"; // Replace "http://example.com" with your actual base URL

  //     // Assuming profileImage contains only filename
  //     const userDataWithProfileImageURL = user_data.map(user => {
  //       return {
  //         ...user._doc,
  //         profileImageURL: baseURL + "/" + user.profilePicture
  //       };
  //     });

  //     return this.sendJSONResponse(
  //       res,
  //       "User data",
  //       {
  //         length: userDataWithProfileImageURL.length,
  //       },
  //       userDataWithProfileImageURL
  //     );
  //   } catch (error) {
  //     if (error instanceof NotFound) {
  //       throw error;
  //     }
  //     return this.sendErrorResponse(req, res, error);
  //   }
  // }
  async user_display(req, res) {
    try {
        const tokenData = req.userdata;
        const userId = tokenData.id;

        
        const baseURL = "https://one-click-backend-mfrv.onrender.com/user";

        
        const user_data = await UserSchema.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'educations',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'educationDetails'
                }
            }
        ]);

        if (user_data.length === 0) {
            throw new Forbidden("You are not a user");
        }

        
        const userDataWithProfileImageURL = user_data.map(user => {
            return {
                ...user,
                profileImageURL: baseURL + "/" + user.profilePicture
            };
        });

        return this.sendJSONResponse(
            res,
            "User data",
            {
                length: userDataWithProfileImageURL.length,
            },
            userDataWithProfileImageURL
        );
    } catch (error) {
        if (error instanceof NotFound) {
            throw error;
        }
        return this.sendErrorResponse(req, res, error);
    }
}



  async edituser(req, res) {
    try {
      const tokenData = req.userdata;

      const user = await UserSchema.findOne({
        _id: tokenData.id,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const newValues = {
        name: req.body.name,
        contact: req.body.contact,
        email: req.body.email,
        // password: req.body.password,        updated password
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        profilePicture: req.file ? req.file.filename : "",
      };

      const updatedUser = await UserSchema.updateOne(
        { _id: tokenData.id },
        {
          $set: {
            name: newValues.name,
            contact: newValues.contact,
            email: newValues.email,
            // password: newValues.password,
            address: newValues.address,
            city: newValues.city,
            state: newValues.state,
            pincode: newValues.pincode,
            profilePicture: newValues.profilePicture,
          },
        }
      );

      return this.sendJSONResponse(
        res,
        "User updated",
        {
          length: "1",
        },
        updatedUser
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async changepassword(req, res) {
    try {
      const tokenData = req.userdata;
      const oldPassword = req.body.oldpassword;
      const newPassword = req.body.newpassword;

      console.log(oldPassword, newPassword);

      const user = await UserSchema.findOne({ _id: tokenData.id });
      if (!user) {
        return this.sendErrorResponse(req, res, "User not found");
      }
      console.log("not found", user);

      if (oldPassword !== user.password) {
        return this.sendErrorResponse(req, res, "Old password is not correct");
      }
      console.log("not matched");
      user.password = newPassword;
      await user.save();
      console.log("password updated", user.password);

      return this.sendJSONResponse(
        res,
        "Password updated successfully",
        {
          length: 1,
        },
        user
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

  async forgetPassword(req, res) {
    try {
      const find_email = await UserSchema.find({ email: req.body.email })

      if (find_email === 0) {
        throw new Forbidden("you are not register")
      }

      const new_password = req.body.new_password;

      const new_user = await UserSchema.updateOne({ email: req.body.email }, { $set: { password: new_password } }
      );

      return this.sendJSONResponse(
        res,
        "Password forget successfully",
        {
          length: 1,
        },
        new_user
      );
    } catch (error) {
      if (error instanceof NotFound) {
        throw error;
      }
      return this.sendErrorResponse(req, res, error);
    }
  }

};
