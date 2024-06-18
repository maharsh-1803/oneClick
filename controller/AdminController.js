const BaseController = require('./BaseController');
const mongoose = require("mongoose")
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const AdminSchema = require('../model/AdminSchema');
const UserSchema = require('../model/UserSchema');
const StartupSchema = require("../model/StartupSchema");
const ProductSchema = require("../model/ProductSchema")
const jwt = require("jsonwebtoken");
const InquirySchema = require('../model/inquirySchema');
const Document = require('../model/DocumentSchema');


module.exports = class AdminController extends BaseController {
    documentStatusChange = async (req, res) => {
        try {
            const tokenData = req.userdata;
            const { id } = req.params;
            const { status } = req.body;
    
            const admin = await AdminSchema.findById(tokenData._id);
            if (!admin) {
                return res.status(403).json({
                    message: "Only admin can change document status"
                });
            }
    
            if (!['approve', 'decline'].includes(status)) {
                return res.status(400).json({
                    message: "Invalid status value"
                });
            }
    
            const document = await Document.findByIdAndUpdate(
                id,
                { status: status },
                { new: true } 
            );
    
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }
    
            return res.status(200).json({
                message: "Document status changed successfully",
                document: document
            });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    };
    async postadmin(req, res) {
        try {
            const data = {
                username: req.body.username,
                password: req.body.password
            };

            const admindata = new AdminSchema(data)
            const admin = await admindata.save();

            return this.sendJSONResponse(
                res,
                "data saved",
                {
                    length: 1
                },
                admin
            );
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }

    async logadmin(req, res) {
        try {

            const username = req.body.username;
            const password = req.body.password;

            const admin = await AdminSchema.findOne({ username: username })

            if (admin) {
                if (admin.password === password) {
                    const token = jwt.sign({
                        _id: admin._id,
                        username: admin.username,
                        password: admin.password
                    }, process.env.SECRET_KEY);

                    admin.token = token;
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Password is incorrect"
                    })
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Uername is incorrect"
                })
            }

            return this.sendJSONResponse(
                res,
                "Logged In",
                {
                    length: 1
                },
                admin.token
            );

        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }

    async changePassword(req, res) {
        try {

            // const username = req.body.username;
            const { password, newPassword } = req.body;
            const tokenData = req.userdata;

            // Find admin by id
            const admin = await AdminSchema.findById(tokenData);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            // Check if old password matches
            if (admin.password !== password) {
                return res.status(400).json({
                    success: false,
                    message: 'Old password does not match'
                });
            }

            // Update password
            admin.password = newPassword;
            await admin.save();

            return res.status(200).json({
                message: 'Password changed successfully',
                data: admin
            });

        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }


    async forgetPassword(req, res) {
        try {

            const username = req.body.username;

            const admin = await AdminSchema.findOne({ username: username })

            const new_password = req.body.new_password;

            const new_admin = await AdminSchema.updateOne({ username: username }, { $set: { password: new_password } }
            );

            if (admin) {
                return this.sendJSONResponse(
                    res,
                    "Mail sent",
                    {
                        length: 1
                    },
                    new_admin
                );
            }

        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }

    async allUserDisplay(req, res) {
        try {
            let tokenData = req.userdata
            const admin = await AdminSchema.findById(tokenData);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            let allUserData = await UserSchema.find().select('-password')
            if (allUserData) {
                res.status(200).json({
                    success: true,
                    message: "User Find Successfully",
                    data: allUserData
                })
            } else {
                res.status(401).json({
                    success: false,
                    message: "User Not Found!"
                })
            }
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }


    async userDisplayById(req, res) {
        try {
            let user_id = req.query.user_id;
            let tokenData = req.userdata;
            const admin = await AdminSchema.findById(tokenData);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            let userData = await UserSchema.findById(user_id).select('-password');

            if (!userData) {
                return res.status(400).json({
                    success: false,
                    message: "User Not Found!"
                });
            }

            // Create base URL for user profile image
            const baseURL = "https://oneclick-sfu6.onrender.com/user";

            // If user has profile picture, append it to the base URL
            let profileImageURL = null;
            if (userData.profilePicture) {
                profileImageURL = baseURL + "/" + userData.profilePicture;
            }
            
            const documentDetails = await Document.find({ userId: user_id });


            // Return user data with profile image URL
            res.status(200).json({
                success: true,
                message: "User Found Successfully",
                data: {
                    ...userData._doc,
                    profileImageURL: profileImageURL,
                    DocumentDetail:documentDetails
                }
            });
        } catch (error) {
            // Handle errors
            return this.sendErrorResponse(req, res, error);
        }
    }


    async allStartupDisplay(req, res) {
        try {
            let tokenData = req.userdata
            const admin = await AdminSchema.findById(tokenData);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }
            let startupData = await StartupSchema.find()
            if (startupData) {
                res.status(200).json({
                    success: true,
                    message: "startup Find Successfully",
                    data: startupData
                })
            } else {
                res.status(401).json({
                    success: false,
                    message: "startup Not Found!"
                })
            }
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }


    async startupDisplayById(req, res) {
        try {
            let startupId = req.query.startupId;
            let tokenData = req.userdata;
            const admin = await AdminSchema.findById(tokenData);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            let startupData = await StartupSchema.aggregate([
                {
                    $match: { _id: mongoose.Types.ObjectId(startupId) }
                },
                {
                    $lookup: {
                        from: 'products', // Assuming your product collection is named 'products'
                        localField: '_id', // Field from startup schema
                        foreignField: 'startupId', // Field from product schema referencing startup
                        as: 'products' // Field to store matched products
                    }
                }
            ]);

            if (startupData.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Startup not found'
                });
            }

            const startupBaseURL = 'https://one-click-backend-1.onrender.com/startup'; // Replace 'https://your-base-url.com' with your actual base URL

            // Update startup logo URL
            if (startupData[0].startupLogo) {
                startupData[0].startupLogo = `${startupBaseURL}/${startupData[0].startupLogo}`;
            }


            const baseURL = 'https://one-click-backend-1.onrender.com/product'; // Replace 'https://your-base-url.com' with your actual base URL

            // Iterate through each product and update productPhotos URLs
            startupData[0].products.forEach(product => {
                if (product.productPhotos) {
                    product.productPhotos = product.productPhotos.map(photo => `${baseURL}/${photo}`);
                }
            });

            return res.json({
                success: true,
                message: 'Startup details retrieved successfully',
                startup: startupData[0] // Assuming only one startup is expected
            });

        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }


    async productDisplayById(req, res) {
        try {
            let product_id = req.query.product_id;
            let tokenData = req.userdata;
            const admin = await AdminSchema.findById(tokenData);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            let productData = await ProductSchema.findById(product_id);

            if (!productData) {
                return res.status(401).json({
                    success: false,
                    message: "Product Not Found!"
                });
            }

            const baseURL = 'https://oneclick-sfu6.onrender.com/product'; // Replace 'https://your-base-url.com' with your actual base URL
            if (productData.productPhotos) {
                productData.productPhotos = productData.productPhotos.map(photo => `${baseURL}/${photo}`);
            }

            res.status(200).json({
                success: true,
                message: "Product Found Successfully",
                data: productData
            });
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }


    async displayAllInquiry(req, res) {
        try {
            let tokenData = req.userdata;
            const admin = await AdminSchema.findById(tokenData);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }
            let allInquiry = await InquirySchema.find();
            if (allInquiry) {
                res.status(200).json({
                    success: true,
                    message: "All inquiry find successfully",
                    data: allInquiry
                })
            } else {
                res.status(401).json({
                    success: false,
                    message: "inquiry not found!"
                })
            }
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }

    async inquiryDetails(req, res) {
        let inquiry_id = req.query.inquiry_id

        let tokenData = req.userdata;
        const admin = await AdminSchema.findById(tokenData);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        let inquiryData = await InquirySchema.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(inquiry_id) }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData",
                },
            },
            {
                $unwind: "$productData",
            },
            {
                $lookup: {
                    from: "startups",
                    localField: "productData.startupId",
                    foreignField: "_id",
                    as: "startupData",
                },
            },
            {
                $unwind: "$startupData",
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $unwind: "$userData",
            },
            {
                $project: {
                    "inquiryData": {
                        "_id": "$_id",
                        "title": "$title",
                        "description": "$description",
                        "best_time_to_connect": "$best_time_to_connect",
                        "createdAt": "$createdAt",
                        "updatedAt": "$updatedAt"
                    },
                    "productData": {
                        "productName": "$productData.productName",
                        "description": "$productData.description",
                        "productprice": "$productData.productprice",
                        "productcolor": "$productData.productcolor",
                        "productstatus": "$productData.productstatus",
                        "createdAt": "$productData.createdAt",
                        "updatedAt": "$productData.updatedAt"
                    },
                    "startupData": {
                        "startupName": "$startupData.startupName",
                        "address": "$startupData.address",
                        "contactNumber": "$startupData.contactNumber",
                        "contactPerson": "$startupData.contactPerson",
                        "email": "$startupData.email",
                        "city": "$startupData.city",
                        "state": "$startupData.state",
                        "country": "$startupData.country",
                        "inqubationCenterCity": "$startupData.inqubationCenterCity",
                        "yearOfEstablished": "$startupData.yearOfEstablished",
                        "registeredAs": "$startupData.registeredAs",
                        "pincode": "$startupData.pincode",
                        "createdAt": "$startupData.createdAt",
                        "updatedAt": "$startupData.updatedAt"
                    },
                    "userData": {
                        "name": "$userData.name",
                        "contact": "$userData.contact",
                        "email": "$userData.email",
                        "address": "$userData.address",
                        "city": "$userData.city",
                        "state": "$userData.state",
                        "pincode": "$userData.pincode",
                        "status": "$userData.status",
                        "createdAt": "$userData.createdAt",
                        "updatedAt": "$userData.updatedAt",
                    }
                }
            }
        ])
        res.status(200).json({
            success: true,
            message: "Inquiry details find successfully",
            data: inquiryData
        })
    }

}
