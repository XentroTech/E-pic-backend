const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Game = require("../Models/gameModel");
const ErrorHandler = require("../utils/errorHandler");

exports.createGameTime = catchAsyncErrors(async (req, res, next) => {
  const { gameTime } = req.body;
  const newGameTime = await Game.create({
    gameTime: gameTime,
    country: req.user.country,
  });

  await newGameTime.save();

  res.status(200).json({
    success: true,
    message: "New Game Time Added",
    newGameTime,
  });
});

exports.getGameTime = catchAsyncErrors(async (req, res, next) => {
  const gameTime = await Game.find({ country: req.user.country });

  if (!gameTime) {
    return next(new ErrorHandler("Game Time not found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Successfully fetched game time.",
    gameTime,
  });
});

exports.updateGameTime = catchAsyncErrors(async (req, res, next) => {
  const gameTimes = await Game.findOne({ _id: req.params.id });

  if (!gameTimes) {
    return next(new ErrorHandler("Game time not found", 404));
  }
  const updatedGameTime = await Game.findByIdAndUpdate(
    req.params.id,
    req.body.data,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Game time has been updated",
    updatedGameTime,
  });
});

exports.deleteGameTime = catchAsyncErrors(async (req, res, next) => {
  const gameTime = await Game.findById(req.params.id);
  if (!gameTime) {
    return next(new ErrorHandler("Game time not found", 404));
  }

  await gameTime.deleteOne();

  res.status(200).json({
    success: true,
    message: "Game time has been deleted",
  });
});
