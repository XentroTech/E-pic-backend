const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");
const ErrorHandler = require("../utils/errorHandler");

exports.getGameLeaderBoard = catchAsyncErrors(async (req, res, next) => {
  const { date } = req.query;

  let startOfDay, endOfDay;
  if (!date) {
    const now = new Date();

    startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
  } else {
    const selectedDate = new Date(date);
    startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
  }
  //fetch data
  const leaderBoard = await GameLeaderBoard.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    country: req.user.country,
  })
    .populate("user", "name profile_pic")
    .sort({ duration: 1 })
    .limit(10);
  //if leaderBoard not found
  if (!leaderBoard || leaderBoard.length <= 0) {
    return next(
      new ErrorHandler("No leaderboard found for selected date", 400)
    );
  }
  res.status(200).json({
    success: true,
    message: `successfully fetched leaderBoard from ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`,
    leaderBoard,
  });
});
