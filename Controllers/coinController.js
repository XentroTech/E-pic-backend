const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Coin = require("../Models/coinModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/userModel");

//create coin info
exports.createCoinInfo = catchAsyncErrors(async (req, res, next) => {
  const { coin, price, image_url } = req.body;
  const coinInfo = await Coin({
    coin,
    price,
    image_url,
  });

  await coinInfo.save();

  res.status(200).json({
    success: true,
    message: "Coin info created successfully!",
    coinInfo,
  });
});

// get coin info
exports.getCoinInfo = catchAsyncErrors(async (req, res, next) => {
  const coinInfo = await Coin.find({});

  res.status(200).json({
    success: true,
    coinInfo,
  });
});

//update coin info
exports.updateCoinInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const updatedCoinInfo = await Coin.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCoinInfo) {
    return res
      .status(404)
      .json({ success: false, message: "Coin info not found" });
  }

  res.status(200).json({
    success: true,
    updatedCoinInfo,
  });
});

// delete coin info
exports.deleteCoinInfo = catchAsyncErrors(async (req, res, next) => {
  const info = await Coin.findById(req.params.id);

  if (!info) {
    return next(new ErrorHandler("Coin Info not found", 404));
  }

  await info.deleteOne();
  res.status(200).json({
    success: true,
    message: "successfully deleted",
  });
});

// purchase coin
exports.purchaseCoin = catchAsyncErrors(async (req, res, next) => {
  const { coin, price, paymentDetails } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const paymentSuccess = true; //processPayment(paymentDetails);
  if (paymentSuccess) {
    user.wallet += coin;
    await user.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Successfully purchased ${coin} coin`,
    });
  } else {
    return next(new ErrorHandler("payment not successful", 401));
  }
});
