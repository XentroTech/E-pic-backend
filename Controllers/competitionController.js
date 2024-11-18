const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Competition = require("../Models/competitionModel");
const ErrorHandler = require("../utils/errorHandler");
//create competition
exports.createCompetition = catchAsyncErrors(async (req, res, next) => {
  const { title, startDate, endDate } = req.body;
  const competition = await Competition.create({
    title,
    startDate,
    endDate,
  });

  res.status(200).json({
    success: true,
    message: "competition created",
    competition,
  });
});

//get competition
exports.getCompetition = catchAsyncErrors(async (req, res, next) => {
  const competitions = await Competition.find({});
  if (!competitions) {
    return next(new ErrorHandler("Competitions not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "fetched competitions",
    competitions,
  });
});
//update competition
exports.updateCompetition = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const updatedCompetition = await Coin.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCompetition) {
    return res
      .status(404)
      .json({ success: false, message: "update info not found" });
  }

  res.status(200).json({
    success: true,
    updatedCompetition,
  });
});
//delete competition
exports.deleteCompetition = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params.id;

  const competition = await Competition.findById(id);

  if (!competition) {
    return next(new ErrorHandler("Competition not found"));
  }

  await competition.deleteOne();

  res.status(200).json({
    success: true,
    message: "competition has been deleted",
  });
});
