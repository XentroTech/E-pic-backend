const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ImageSpace = require("../Models/imageSpaceInfoModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/userModel");

//create image space info
exports.createImageSpaceInfo = catchAsyncErrors(async (req, res, next) => {
  const { space, price, image_url } = req.body;
  console.log(space, price, image_url);
  const newSpace = await ImageSpace({
    space,
    price,
    image_url,
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
  const { paymentDetails } = req.body;

  const space = req.params;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const paymentSuccess = true; //processPayment(paymentDetails);
  if (paymentSuccess) {
    user.image_limit += space;
    await user.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Successfully purchased ${newSpace} spaces`,
    });
  } else {
    return next(new ErrorHandler("payment not successful", 401));
  }
});
