const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const WelcomeScreen = require("../Models/welcomeScreenModel");
const BASE_URL = "https://dev.e-pic.co/";
const ErrorHandler = require("../utils/errorHandler.js");

// store welcome screen data to db
exports.uploadWelcomeScreenImages = catchAsyncErrors(async (req, res, next) => {
  const { title } = req.body;

  if (!title || !req.files) {
    return next(new ErrorHandler("Please provide all info"));
  }
  if (req.files && req.files.image_url) {
    image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
  }

  const newWelcomeInfo = await WelcomeScreen.create({
    title,
    image_url,
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Welcome Screen info created successfully",
    newWelcomeInfo,
  });
});

// get welcome screen info
exports.getWelcomeScreenInfo = catchAsyncErrors(async (req, res, next) => {
  //fetching info data from db
  const welcomeScreenInfo = await WelcomeScreen.find({});
  // in info not found
  if (!welcomeScreenInfo) {
    return next(new ErrorHandler("Welcome screen info not found"));
  }
  res.status(200).json({
    success: true,
    message: "Successfully fetched welcomeScreen info",
    welcomeScreenInfo,
  });
});

//delete info
exports.deleteWelcomeScreenInfo = catchAsyncErrors(async (req, res, next) => {
  // fetching info data from db
  const deleteInfo = await WelcomeScreen.findById(req.params.id);
  // if info not found
  if (!deleteInfo) {
    return next(new ErrorHandler("Welcome Screen Info not found", 400));
  }

  await deleteInfo.deleteOne();

  res.status(200).json({
    success: true,
    message: "Info Deleted successfully",
  });
});
