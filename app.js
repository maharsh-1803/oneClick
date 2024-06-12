// main file (e.g., app.js)

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
// var cors = require('cors');

var admin_router = require("./router/AdminRouter");
var user_router = require("./router/UserRouter");
var category_router = require("./router/CategoryRouter");
var subcategory_router = require("./router/SubcategoryRouter");
var feedback_router = require("./router/FeedbackRouter");
var startup_router = require("./router/StartupRouter");
var product_router = require("./router/ProductRouter");
var review_router = require("./router/ReviewRouter");
var inqubation_router = require("./router/InqubationRouter");
var inquiry_router = require("./router/InquiriesRouter");
var award_router = require("./router/AwardRouter");
var certificate_router = require("./router/CertificateRouter");
var chat_router = require("./router/chatRouter");
var Education_router = require('./router/EducationRouter')

var mongoCon = require("./config/db");
const { app } = require("./socket/socket");

// CORS configuration
// const corsOptions = {
//   origin: ['http://localhost:5173', 'http://localhost:3000', 'https://one-click-frontend.onrender.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set view image
app.use("/", express.static("./storage/images/startup"));
app.use("/user", express.static("./storage/images/profile"));
app.use("/product", express.static("./storage/images/product"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Use routers
app.use("/api/admin", admin_router);
app.use("/api/user", user_router);
app.use("/api/category", category_router);
app.use("/api/subcategory", subcategory_router);
app.use("/api/feedback", feedback_router);
app.use("/api/startup", startup_router);
app.use("/api/product", product_router);
app.use("/api/review", review_router);
app.use("/api/inqubation", inqubation_router);
app.use("/api/inquiry", inquiry_router);
app.use("/api/award", award_router);
app.use("/api/certificate", certificate_router);
app.use("/api/chat", chat_router);
app.use('/api/Education',Education_router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  console.log(err.message);
  // res.render('error');
});

module.exports = app;
