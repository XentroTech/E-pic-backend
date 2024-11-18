const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Competition = require("../Models/competitionModel");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");

exports.competitionLeaderBoard = catchAsyncErrors(async (req, res, next) => {
  const competition = await Competition.findOne({}).sort({ endDate: -1 });
  const images = await Image.find({ competition: competition._id })
    .populate("owner", "name, profile_pic")
    .sort({ likesCount: -1 })
    .limit(10);

  if (!images) {
    return next(new ErrorHandler("Competition Images Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "successfully fetched leaderboard",
    images,
  });
});
