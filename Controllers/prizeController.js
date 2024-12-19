const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Prize = require("../Models/prizeModel");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/userModel");
const GameLeaderBoard = require("../Models/gameLeaderBoardModel");
const Competition = require("../Models/competitionModel");
const AppNotification = require("../Models/appNotificationModel");
//create prize info
const BASE_URL = "https://dev.e-pic.co/";

exports.createPrizeInfo = catchAsyncErrors(async (req, res, next) => {
  let { type, name, rank, value, image_url, position, price } = req.body;

  try {
    // Process image if included
    if (req.files && req.files.image_url) {
      image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
    }

    // Ensure required fields are not empty
    if (
      !type ||
      !name ||
      !rank ||
      !value ||
      !image_url ||
      !position ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, position, and image URL are required.",
      });
    }

    // Create new prize info
    const prizeInfo = new Prize({
      type,
      name,
      rank,
      image_url,
      value,
      position,
      price,
      country: req.user.country,
    });

    await prizeInfo.save();

    res.status(200).json({
      success: true,
      message: "Prize info created successfully!",
      prizeInfo,
    });
  } catch (error) {
    console.error("Error in createPrizeInfo:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create prize info.",
      error: error.message,
    });
  }
});

// get prize info
exports.getPrizeInfo = catchAsyncErrors(async (req, res, next) => {
  const prizeInfo = await Prize.find({ country: req.user.country });

  res.status(200).json({
    success: true,
    prizeInfo,
  });
});

//update prize info
exports.updatePrizeInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const prizeInfo = await Prize.findById(id);
  console.log(req.body);
  if (!prizeInfo) {
    return next(new ErrorHandler("Prize Info not found!", 404));
  }
  let image_url = prizeInfo.image_url;
  if (req.files && req.files.image_url) {
    image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
  }
  const updatedPrizeInfo = await Prize.findByIdAndUpdate(
    id,
    { ...req.body, image_url },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPrizeInfo) {
    return res
      .status(404)
      .json({ success: false, message: "Prize info not found" });
  }

  res.status(200).json({
    success: true,
    updatedPrizeInfo,
  });
});

// delete prize info
exports.deletePrizeInfo = catchAsyncErrors(async (req, res, next) => {
  const info = await Prize.findById(req.params.id);

  if (!info) {
    return next(new ErrorHandler("Prize Info not found", 404));
  }

  await info.deleteOne();
  res.status(200).json({
    success: true,
    message: "successfully deleted",
  });
});

//get winners info
exports.getWinnersInfo = catchAsyncErrors(async (req, res, next) => {
  const { date, type = "game" } = req.query;
  if (!type || !["game", "competition"].includes(type)) {
    return next(
      new ErrorHandler("Invalid type. Use 'game' or 'competition'.", 400)
    );
  }

  if (!date) {
    const today = new Date();
    date = today.toISOString().split("T")[0];
  }
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  let leaderboard;

  if (type === "game") {
    leaderboard = await GameLeaderBoard.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      country: req.user.country,
    })
      .sort({ duration: 1 })
      .limit(10)
      .populate("user", "name wallet");
  } else if (type === "competition") {
    const competition = await Competition.findOne({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      country: req.user.country,
    });

    if (!competition) {
      return next(
        new ErrorHandler("Competition not found for the given date.", 404)
      );
    }

    leaderboard = await Image.find({ competition: competition._id })
      .sort({ likesCount: -1 })
      .limit(10)
      .populate("owner", "name wallet");
  }
  if (!leaderboard || leaderboard.length === 0) {
    return next(new ErrorHandler("No winners found for the given date.", 404));
  }

  res.status(200).json({
    success: true,
    message: "successfully fetched leaderboard info",
    leaderboard,
  });
});

// prize distribution
exports.distributePrizes = catchAsyncErrors(async (req, res, next) => {
  const { date, type } = req.body;

  if (!type || !["game", "competition"].includes(type)) {
    return next(
      new ErrorHandler("Invalid type. Use 'game' or 'competition'.", 400)
    );
  }

  if (!date) {
    const today = new Date();
    date = today.toISOString().split("T")[0];
  }
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  let leaderboard;

  if (type === "game") {
    leaderboard = await GameLeaderBoard.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ duration: 1 })
      .limit(10)
      .populate("user", "name wallet");
  } else if (type === "competition") {
    const competition = await Competition.findOne({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!competition) {
      return next(
        new ErrorHandler("Competition not found for the given date.", 404)
      );
    }

    leaderboard = await Image.find({ competition: competition._id })
      .sort({ likesCount: -1 })
      .limit(10)
      .populate("owner", "name wallet");
  }
  if (!leaderboard || leaderboard.length === 0) {
    return next(new ErrorHandler("No winners found for the given date.", 404));
  }

  // Fetch prizes for the day
  const prizes = await Prize.find().sort({ rank: 1 });
  if (!prizes || prizes.length === 0) {
    return next(new ErrorHandler("Prizes not set for the given date.", 404));
  }

  // Distribute prizes and notify users
  const prizeDistribution = [];

  for (let i = 0; i < leaderboard.length; i++) {
    const winner = leaderboard[i].user || leaderboard[i].owner;
    const prize = prizes[i];

    if (!prize) break;

    if (prize.type === "physical") {
      await AppNotification.create({
        user: winner._id,
        title: "Game prize",
        message: `Congratulations! You have won a ${prize.name}. It will be sent to you via courier shortly.`,
        country: req.user.country,
        senderImage: "",
      });

      prizeDistribution.push({
        user: winner._id,
        prize: prize.name,
        message: `Physical prize (${prize.name}) notification sent.`,
        country: req.user.country,
      });
    } else if (prize.type === "coin") {
      // Add coins to user's wallet
      winner.wallet += prize.value;
      await winner.save();

      // Notify the user about wallet update
      await AppNotification.create({
        user: winner._id,
        title: "Game Prize",
        message: `Congratulations! You have won ${prize.value} coins. They have been added to your wallet.`,
        country: req.user.country,
        senderImage: "",
      });

      prizeDistribution.push({
        user: winner._id,
        prize: `${prize.value} coins`,
        message: `${prize.value} coins added to wallet and notification sent.`,
        country: req.user.country,
      });
    }
  }

  res.status(200).json({
    success: true,
    message: "Prizes distributed successfully!",
    prizeDistribution,
  });
});
