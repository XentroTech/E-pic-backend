const User = require("../Models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//get Top sellers
exports.getTopSellers = catchAsyncErrors(async (req, res, next) => {
  const topSellers = await User.find({})
    .sort({ total_sales: -1 })
    .limit(10)
    .select("name profile_pic");
  if (!topSellers) {
    return next(new ErrorHandler("Top sellers not found", 404));
  }

  res.status(200).json({ success: true, statusCode: 200, topSellers });
});

// get
