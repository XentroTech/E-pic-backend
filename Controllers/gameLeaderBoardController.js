const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");
const ErrorHandler = require("../utils/errorHandler");

exports.getGameLeaderBoard = catchAsyncErrors(async (req, res, next) => {
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

  try {
    // Query the leaderboard for results within the date range
    const leaderBoard = await GameLeaderBoard.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("user", "name profile_pic")
      .sort({ duration: 1 })
      .limit(10);

    if (!leaderBoard || leaderBoard.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No leaderboard results found for ${date}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Leaderboard results for ${date}`,
      leaderBoard,
    });
  } catch (error) {
    return next(
      new ErrorHandler("An error occurred while fetching the leaderboard.", 500)
    );
  }
});
