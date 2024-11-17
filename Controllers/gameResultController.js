const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameResult = require("../Models/gameResultModel");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");

exports.createGameResult = catchAsyncErrors(async (req, res, next) => {
  const { imageId, duration } = req.body;

  const image = await Image.findById(imageId);

  const gameImage = image.bought_by.includes(req.user._id);

  if (!gameImage) {
    return next(new ErrorHandler("Please Buy An Image"));
  }

  //creating new game result to the model
  const newGameResult = await GameResult.create({
    userId: req.user._id,
    imageId,
    duration,
  });
  await newGameResult.save();
  // updating the leaderboard
  const updateLeaderBoard = await GameLeaderBoard.create({
    user: req.user._id,
    duration,
  });

  await updateLeaderBoard.save();

  // removing the buyer id from the image
  image.bought_by.pull(req.user._id);
  await image.save();

  res.status(200).json({
    success: true,
    message: "Game result created Successfully",
    newGameResult,
    updateLeaderBoard,
  });
});

exports.getGameResult = catchAsyncErrors(async (req, res, next) => {
  const gameResult = await GameResult.find({});

  if (!gameResult) {
    return next(new ErrorHandler("Game Result Not Found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Game result successfully Fetched",
    gameResult,
  });
});
