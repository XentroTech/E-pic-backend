const Coin = require("../Models/coinModel");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.checkPromoExpiration = catchAsyncErrors(async (req, res, next) => {
  await Coin.updateMany(
    { promoActive: true, promoExpiration: { $lt: new Date() } },
    { $set: { promoActive: false } }
  );
  next();
});
