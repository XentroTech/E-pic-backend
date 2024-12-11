// controllers/adController.js
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const AdReward = require("../Models/adRewardModel");
const User = require("../Models/userModel");

const ErrorHandler = require("../utils/errorHandler");

exports.rewardUserForAd = catchAsyncErrors(async (req, res) => {
  const { adCount } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  let awardedCoin = 1;
  const newAd = await AdReward.create({
    user: req.user._id,
    adCount,
    awardedCoin,
    country: req.user.country,
  });
  await newAd.save();
  // saving ad details in user model
  user.adDetails.push({
    adCount,
    awardedCoin,
  });
  user.wallet += 1;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Congratulations! You got 1 coin  ",
    newAd,
  });
});
