const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");
const ErrorHandler = require("../utils/errorHandler");

exports.getGameLeaderBoard = catchAsyncErrors(async (req, res, next) => {
  let { date } = req.body;

  // If no date is provided, will show today's date
  if (!date) {
    const today = new Date();
    date = today.toISOString().split("T")[0];
  }

  let leaderBoard;

  try {
    // Query the leaderboard for the specific date
    leaderBoard = await GameLeaderBoard.find({ date })
      .populate("user", "name profile_pic")
      .sort({ duration: 1 })
      .limit(10);

    if (!leaderBoard || leaderBoard.length === 0) {
      return next(
        new ErrorHandler(`No leaderboard results found for ${date}.`, 404)
      );
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
