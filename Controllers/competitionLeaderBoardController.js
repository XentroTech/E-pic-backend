const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Competition = require("../Models/competitionModel");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");

exports.competitionLeaderBoard = catchAsyncErrors(async (req, res, next) => {
  let { date } = req.body;

  // If no date is provided, use today's date
  if (!date) {
    const today = new Date();
    date = today.toISOString().split("T")[0];
  }

  // Define the start and end of the day
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const competition = await Competition.findOne({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
  console.log(competition);
  const images = await Image.find({ competition: competition._id })
    .sort({ likesCount: -1 })
    .populate("owner", "name email profile_pic")
    .limit(15);
  if (!images) {
    return next(new ErrorHandler("Competition Images Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "successfully fetched leaderboard",
    images,
  });
});
