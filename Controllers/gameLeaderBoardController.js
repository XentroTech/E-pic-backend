const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");
const ErrorHandler = require("../utils/errorHandler");

exports.getGameLeaderBoard = catchAsyncErrors(async (req, res, next) => {
  const { date } = req.query;

  let startOfDay, endOfDay;
  if (!date) {
    const now = new Date();
    endOfDay = new Date(now);
    // today 9pm
    endOfDay.setHours(21, 0, 0, 0);
    if (now < endOfDay) {
      // set as previous  day
      endOfDay.setDate(endOfDay.getDate() - 1);
    }
    startOfDay = new Date(endOfDay);
    // previous day 9pm
    startOfDay.setDate(startOfDay.getDate() - 1);
  } else {
    const selectedDate = new Date(date);
    startOfDay = new Date(selectedDate);
    // selected day's 9pm
    startOfDay.setHours(21, 0, 0, 0);

    endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
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
