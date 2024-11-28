const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Entry = require("../Models/competitionEntryModels");
const Competition = require("../Models/competitionModel");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");

const BASE_URL = "http://dev.e-pic.co/";

exports.createEntry = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    category,
    camera,
    camera_model,
    camera_lens,
    captured_date,
    entryFee,
  } = req.body;
  const currentCompetition = await Competition.findOne({}).sort({
    endDate: -1,
  });
  console.log("from competition creation:", currentCompetition);
  let image_url = "";
  if (req.files) {
    if (req.files.image_url) {
      image_url = `${BASE_URL}${req.files.image_url[0].path.replace(
        /\\/g,
        "/"
      )}`;
    }
  }
  // checking image limit
  if (req.user.image_limit < 1) {
    return next(
      new ErrorHandler("You exceed your image limit please buy image space")
    );
  }
  // uploading image
  const newImage = new Image({
    title,
    description,
    category,
    image_url,
    owner: req.user._id,
    camera,
    camera_model,
    camera_lens,
    captured_date,
    competition: currentCompetition._id,
  });

  req.user.uploaded_images.push(newImage._id);
  await newImage.save();

  // checking coin
  if (req.user.wallet < entryFee) {
    return next(new ErrorHandler("Insufficient pic coin please buy coin"));
  }
  // Save the entry
  const entry = new Entry({
    user: req.user._id,
    competition: currentCompetition._id,
    image: newImage._id,
    entryFee: entryFee,
  });

  await entry.save();

  res.status(200).json({
    success: true,
    message: "User Successfully Entered Into the competition",
    entry,
    newImage,
  });
});
