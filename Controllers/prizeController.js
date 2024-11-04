const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Prize = require("../Models/prizeModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/userModel");

//create prize info
exports.createPrizeInfo = catchAsyncErrors(async (req, res, next) => {
  const { title, position, image_url } = req.body;
  const prizeInfo = await Prize({
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
