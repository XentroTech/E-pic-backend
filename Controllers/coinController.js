const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Coin = require("../Models/coinModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/userModel");

//create coin info
// controllers/coinController.js

exports.createCoinInfo = catchAsyncErrors(async (req, res, next) => {
  const { coin, price, image_url, extraCoins, promoExpiration } = req.body;

  const promoActive = promoExpiration ? true : false;

  const coinInfo = await Coin({
    coin,
    price,
    image_url,
    extraCoins: extraCoins || 0,
    promoExpiration,
    promoActive,
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
  const { coinId, coin, price, paymentDetails } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Fetch coin info to check for active promo
  const coinInfo = await Coin.findById(coinId);
  if (!coinInfo) {
    return next(new ErrorHandler("Coin info not found", 404));
  }

  // Check if promo is active and valid
  let finalCoinAmount = coin;
  if (coinInfo.promoActive && coinInfo.promoExpiration > new Date()) {
    finalCoinAmount += coinInfo.extraCoins; // Add extra coins from promo
  } else if (coinInfo.promoActive && coinInfo.promoExpiration <= new Date()) {
    // Deactivate promo if expired
    coinInfo.promoActive = false;
    await coinInfo.save();
  }

  const paymentSuccess = true; // processPayment(paymentDetails);
  if (paymentSuccess) {
    user.wallet += finalCoinAmount;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully purchased ${finalCoinAmount} coin(s).`,
    });
  } else {
    return next(new ErrorHandler("Payment not successful", 401));
  }
});
