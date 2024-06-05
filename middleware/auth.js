// const config = require('../config/config').get(process.env.NODE_ENV);
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = async (req, res, next) => {
  try {
    console.log("req.headers", req.headers);
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "token not found",
      });
    }
    // console.log(token);
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    console.log("token", token);
    console.log(decoded);
    req.userdata = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth fail",
    });
  }
  //   return next();
};

module.exports = verifyToken;
