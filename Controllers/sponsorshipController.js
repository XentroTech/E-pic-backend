// controllers/sponsorshipController.js
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Sponsorship = require("../Models/sponsorshipModel");

const BASE_URL = "http://localhost:3000/";
// create sponsor
exports.createSponsorship = catchAsyncErrors(async (req, res) => {
  const { brandName, adLocation, startDate, endDate } = req.body;
  let image_url = "";
  if (req.files && req.files.image_url) {
    image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
  }
  if (!brandName || !adLocation || !image_url || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Provide all information.",
    });
  }
  const sponsorship = new Sponsorship({
    brandName,
    image_url,
    adLocation,
    startDate,
    endDate,
  });

  await sponsorship.save();
  res
    .status(201)
    .json({ message: "Sponsorship created successfully!", sponsorship });
});

// get sponsor
exports.getActiveSponsorships = catchAsyncErrors(async (req, res) => {
  const currentDate = new Date();

  const sponsorships = await Sponsorship.find({
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  });

  res.status(200).json({
    success: true,
    sponsorships,
  });
});

//update sponsor
exports.updateSponsor = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const sponsor = await Sponsorship.findById(id);

  if (!sponsor) {
    return next(new ErrorHandler("Sponsor not found!", 404));
  }
  let image_url = sponsor.image_url;
  if (req.files && req.files.image_url) {
    image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
  }
  const updatedSponsor = await Sponsorship.findByIdAndUpdate(
    id,
    { ...req.body, image_url },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedSponsor) {
    return res
      .status(404)
      .json({ success: false, message: "Sponsor not found" });
  }

  res.status(200).json({
    success: true,
    updatedSponsor,
  });
});

// delete sponsor
exports.deleteSponsor = catchAsyncErrors(async (req, res, next) => {
  const sponsor = await Sponsorship.findById(req.params.id);

  if (!sponsor) {
    return next(new ErrorHandler("Sponsor not found", 404));
  }

  await sponsor.deleteOne();
  res.status(200).json({
    success: true,
    message: "successfully deleted",
  });
});
