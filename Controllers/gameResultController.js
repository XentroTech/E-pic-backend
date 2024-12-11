const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const GameResult = require("../Models/gameResultModel");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");

exports.createGameResult = catchAsyncErrors(async (req, res, next) => {
  let { imageId, duration } = req.body;

  const image = await Image.findById(imageId);
  if (!image) {
    return next(new ErrorHandler("Image not found.", 404));
  }

  const purchasedImage = req.user.purchased_images.find(
    (img) => img.image.toString() === imageId && !img.isUsedForGame
  );

  if (!purchasedImage) {
    return next(
      new ErrorHandler(
        "Buy an another image, you have already played with this image "
      )
    );
  }

  // deleting image if result 0
  if (duration <= 0) {
    purchasedImage.isUsedForGame = true;
    purchasedImage.played_at = new Date();
    await req.user.save();
  }

  // not creating game result if game lost
  if (duration <= 0) {
    return res.status(400).json({
      success: false,
      message: "Game result 0",
    });
  }
  let parsedDuration = duration;
  // convert int to float if it was an int
  if (Number.isInteger(duration)) {
    parsedDuration = parseFloat(duration.toFixed(2));
  }

  console.log(parsedDuration);

  const newGameResult = await GameResult.create({
    userId: req.user._id,
    imageId,
    duration: parsedDuration,
    country: req.user.country,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userLeaderBoardEntry = await GameLeaderBoard.findOne({
    user: req.user._id,
    date: { $gte: today },
  });

  if (userLeaderBoardEntry) {
    if (duration < userLeaderBoardEntry.duration) {
      userLeaderBoardEntry.duration = duration;
      await userLeaderBoardEntry.save();
    }
  } else {
    await GameLeaderBoard.create({
      user: req.user._id,
      duration,
      country: req.user.country,
    });
  }

  purchasedImage.isUsedForGame = true;
  purchasedImage.played_at = new Date();
  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Game result created successfully and leaderboard updated.",
    newGameResult,
  });
});

exports.getGameResult = catchAsyncErrors(async (req, res, next) => {
  const gameResult = await GameResult.find({ country: req.user.country });

  if (!gameResult) {
    return next(new ErrorHandler("Game Result Not Found!", 404));
  }
  res.status(200).json({
    success: true,
    message: "Game result successfully Fetched",
    gameResult,
  });
});
