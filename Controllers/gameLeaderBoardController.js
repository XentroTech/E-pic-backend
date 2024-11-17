const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");
const ErrorHandler = require("../utils/errorHandler");

exports.getGameLeaderBoard = catchAsyncErrors(async (req, res, next) => {
  const leaderBoard = await GameLeaderBoard.find({})
    .populate("user", "name, profile_pic")
    .sort({ duration: 1 })
    .limit(10);

  if (!leaderBoard) {
    return next(new ErrorHandler("Game LeaderBoard Not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Successfully fetched Game LeaderBoard",
    leaderBoard,
  });
});
