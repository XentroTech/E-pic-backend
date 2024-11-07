const Image = require("../Models/imageModel");
const User = require("../Models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

//get Top sellers
exports.getTopSellers = catchAsyncErrors(async (req, res, next) => {
  const topSellers = await User.find({})
    .sort({ total_sales: -1 })
    .limit(10)
    .select("name profile_pic");
  if (!topSellers) {
    return next(new ErrorHandler("Top sellers not found", 404));
  }

  res.status(200).json({ success: true, statusCode: 200, topSellers });
});

// get best selling images
exports.getBestSellingImages = catchAsyncErrors(async (req, res, next) => {
  const images = await Image.find({})
    .sort({ sold_count: -1 })
    .limit(10)
    .populate("owner", "name profile_pic");
  if (!images) {
    return next(new ErrorHandler("Images not found", 404));
  }
  res.status(200).json({
    success: true,
    images,
  });
});

// weekly top images
exports.getWeeklyTopSellingImages = catchAsyncErrors(async (req, res, next) => {
  // Get the start and end of the current week
  const startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - startWeek.getDay());
  startWeek.setHours(0, 0, 0, 0); // Set to the start of the day

  const endWeek = new Date();
  endWeek.setDate(endWeek.getDate() + (6 - endWeek.getDay()));
  endWeek.setHours(23, 59, 59, 999); // Set to the end of the day

  const images = await Image.find({
    uploaded_at: { $gte: startWeek, $lte: endWeek },
  })
    .sort({ sold_count: -1 }) // Sort by sold count in descending order
    .populate("owner", "name profile_pic")
    .limit(10); // Limit to top 10 images

  if (!images || images.length === 0) {
    return next(new ErrorHandler("Images not found", 404));
  }

  res.status(200).json({
    success: true,
    images,
  });
});

// for you
exports.getForYouImages = catchAsyncErrors(async (req, res, next) => {
  // Find the user and get their liked images with categories
  const user = await User.findById(req.user._id).populate(
    "liked_images",
    "category"
  );

  let images = [];

  if (user.liked_images && user.liked_images.length > 0) {
    // User has liked images, extract unique categories
    const categories = [
      ...new Set(user.liked_images.map((image) => image.category)),
    ];

    // Fetch images from those categories, excluding the user's own liked images
    images = await Image.find({
      category: { $in: categories },
      _id: { $nin: user.liked_images }, // Exclude already liked images
    })
      .populate("owner", "name profile_pic")
      .limit(20); // Limit to a reasonable number
  } else {
    // User has not liked any images, fetch random images
    images = await Image.aggregate([{ $sample: { size: 20 } }]);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message:
      user.liked_images.length > 0
        ? "Successfully fetched 'For You' images"
        : "Showing random images",
    images,
  });
});

// newly added images
exports.getNewlyAddedImages = catchAsyncErrors(async (req, res, next) => {
  // Get the start and end of the current week
  const startWeek = new Date();
  startWeek.setDate(startWeek.getDate() - startWeek.getDay());
  startWeek.setHours(0, 0, 0, 0); // Set to the start of the day

  const endWeek = new Date();
  endWeek.setDate(endWeek.getDate() + (6 - endWeek.getDay()));
  endWeek.setHours(23, 59, 59, 999); // Set to the end of the day

  const images = await Image.find({
    uploaded_at: { $gte: startWeek, $lte: endWeek },
  });
  if (!images) {
    return next(new ErrorHandler("Images not Added this week", 404));
  }

  res.status(200).json({
    success: true,
    message: "successfully fetched newly added images",
    images,
  });
});
