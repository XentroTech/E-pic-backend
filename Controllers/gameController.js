const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Game = require("../Models/gameModel");
const ErrorHandler = require("../utils/errorHandler");

exports.createGameTime = catchAsyncErrors(async (req, res, next) => {
  const gameTime = req.body;

  const newGameTime = await Game.create({
    gameTime: gameTime,
  });

  await newGameTime.save();

  res.status(200).json({
    success: true,
    message: "New Game Time Added",
    newGameTime,
  });
});

exports.getGameTime = catchAsyncErrors(async (req, res, next) => {
  const gameTime = await Game.find({});

  if (!gameTime) {
    return next(new ErrorHandler("Game Time not found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "Successfully fetched game time.",
    gameTime,
  });
});
