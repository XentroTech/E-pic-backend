const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameResult = require("../Models/gameResultModel");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");

exports.createGameResult = catchAsyncErrors(async (req, res, next) => {
  const { imageId, duration } = req.body;

  const image = await Image.findById(imageId);

  const purchasedImage = req.user.purchased_images.find(
    (img) => img.image.toString() === imageId && !img.isUsedForGame
  );

  if (!purchasedImage) {
    return next(new ErrorHandler("Please buy the image or wait 15 days."));
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
  purchasedImage.isUsedForGame = true;
  purchasedImage.played_at = new Date();
  await req.user.save();

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
