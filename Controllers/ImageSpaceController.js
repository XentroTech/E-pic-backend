const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ImageSpace = require("../Models/imageSpaceInfoModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/userModel");
const Transaction = require("../Models/transactionModal");

//create image space info
exports.createImageSpaceInfo = catchAsyncErrors(async (req, res, next) => {
  const { space, price, image_url, country } = req.body;

  if (!space || !price) {
    return next(new ErrorHandler("Please provide all information", 400));
  }
  const newSpace = await ImageSpace({
    space,
    price,
    country: req.user.country,
  });

  await newSpace.save();

  res.status(200).json({
    success: true,
    message: "Successfully created image space info",
    newSpace,
  });
});

// get image space info
exports.getImageSpacesInfo = catchAsyncErrors(async (req, res, next) => {
  const imageSpaceInfo = await ImageSpace.find({});

  res.status(200).json({
    success: true,
    imageSpaceInfo,
  });
});

//update image space info
exports.updateImageSpacesInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const newImageSpaceInfo = await ImageSpace.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newImageSpaceInfo) {
    return res
      .status(404)
      .json({ success: false, message: "Image space not found" });
  }

  res.status(200).json({
    success: true,
    newImageSpaceInfo,
  });
});

// delete image space info
exports.deleteImageSpacesInfo = catchAsyncErrors(async (req, res, next) => {
  const info = await ImageSpace.findById(req.params.id);

  if (!info) {
    return next(new ErrorHandler("Image Spaces Info not found", 404));
  }

  await info.deleteOne();
  res.status(200).json({
    success: true,
    message: "successfully deleted",
  });
});

// purchase spaces
exports.purchaseSpace = catchAsyncErrors(async (req, res, next) => {
  const { space, price } = req.body;

  const user = await User.findById(req.user._id);

  if (!space || !price) {
    return next(new ErrorHandler("Please input space and price info"));
  }
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (price > user.wallet) {
    return next(new ErrorHandler("Insufficient Coin please buy coin", 400));
  }
  if (price) {
    user.wallet -= price;
    user.image_limit += space;
    await user.save();
    const transactionInfo = await Transaction.create({
      user: req.user._id,
      type: "purchase",
      item: "space",
      amount: space,
      price: price,
      country: req.user.country,
    });
    await transactionInfo.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Congratulations! Successfully purchased ${space} spaces`,
    });
  } else {
    return next(new ErrorHandler("purchase not successful", 401));
  }
});
