const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const CoinConversion = require("../Models/coinConversionModel");
const ErrorHandler = require("../utils/errorHandler");

//create coin conversion info
exports.createCoinConversion = catchAsyncErrors(async (req, res, next) => {
  const { currency, coin } = req.body;

  if (!currency || !coin) {
    return next(new ErrorHandler("provide all information", 400));
  }

  const newConversion = await CoinConversion.create({
    currency,
    coin,
    country: req.user.country,
  });

  res.status(200).json({
    success: true,
    newConversion,
  });
});
// get coin conversion info
exports.getCoinConversionInfo = catchAsyncErrors(async (req, res, next) => {
  const coinConversionInfo = await CoinConversion.find({
    country: req.user.country,
  });

  if (!coinConversionInfo) {
    return next(new ErrorHandler("coin conversion info not found", 400));
  }

  res.status(200).send({
    success: true,
    coinConversionInfo,
  });
});
// delete coin conversion info
exports.deleteCoinConversionInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const coinConversionInfo = await CoinConversion.findByUd(id);

  if (!coinConversionInfo) {
    return next(new ErrorHandler("coin conversion info not found", 400));
  }
  await coinConversionInfo.deleteOne();

  res.status(200).send({
    success: true,
    message: "coin info has been deleted",
  });
});
