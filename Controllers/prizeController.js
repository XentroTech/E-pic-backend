const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Prize = require("../Models/prizeModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/userModel");

//create prize info
const BASE_URL = "http://localhost:3000/";
exports.createPrizeInfo = catchAsyncErrors(async (req, res, next) => {
  let { title, position, image_url } = req.body;

  try {
    // Process image if included
    if (req.files && req.files.image_url) {
      image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
    }

    // Ensure required fields are not empty
    if (!title || !position || !image_url) {
      return res.status(400).json({
        success: false,
        message: "Title, position, and image URL are required.",
      });
    }

    // Create new prize info
    const prizeInfo = new Prize({
      title,
      position,
      image_url,
    });

    await prizeInfo.save();

    res.status(200).json({
      success: true,
      message: "Prize info created successfully!",
      prizeInfo,
    });
  } catch (error) {
    console.error("Error in createPrizeInfo:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create prize info.",
      error: error.message,
    });
  }
});

// get prize info
exports.getPrizeInfo = catchAsyncErrors(async (req, res, next) => {
  const prizeInfo = await Prize.find({});

  res.status(200).json({
    success: true,
    prizeInfo,
  });
});

//update prize info
exports.updatePrizeInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const updatedPrizeInfo = await Prize.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedPrizeInfo) {
    return res
      .status(404)
      .json({ success: false, message: "Prize info not found" });
  }

  res.status(200).json({
    success: true,
    updatedPrizeInfo,
  });
});

// delete prize info
exports.deletePrizeInfo = catchAsyncErrors(async (req, res, next) => {
  const info = await Prize.findById(req.params.id);

  if (!info) {
    return next(new ErrorHandler("Prize Info not found", 404));
  }

  await info.deleteOne();
  res.status(200).json({
    success: true,
    message: "successfully deleted",
  });
});
