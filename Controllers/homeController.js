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
    isLive: true,
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
      // Exclude already liked images
      _id: { $nin: user.liked_images },
    })
      .populate("owner", "name profile_pic")
      .limit(20);
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
    isLive: true,
  }).populate("owner", "name profile_pic");
  if (!images) {
    return next(new ErrorHandler("Images not Added this week", 404));
  }

  res.status(200).json({
    success: true,
    message: "successfully fetched newly added images",
    images,
  });
});

// featured images
exports.makeFeaturedAndRemoveFeaturedImage = catchAsyncErrors(
  async (req, res, next) => {
    const imageId = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return next(new ErrorHandler("Image Not Found!", 404));
    }
    if (image.isFeatured) {
      image.isFeatured = false;
    } else {
      image.isFeatured = true;
    }
    await image.save();

    res.status(200).send({
      success: true,
      message: image.isFeatured
        ? " image remove from features"
        : "image successfully added to the featured images",
    });
  }
);

//get Featured images
exports.getFeaturedImages = catchAsyncErrors(async (req, res, next) => {
  const images = await Image.find({ isFeatured: true }).populate(
    "owner",
    "name profile_pic"
  );

  if (!images) {
    return next(new ErrorHandler("Featured Images Not Found!", 404));
  }
  res.status(200).send({
    success: true,
    message: "Successfully fetched featured Images",
    images,
  });
});

// get images as category
exports.getImagesAsCategory = catchAsyncErrors(async (req, res, next) => {
  if (!req.params.category) {
    return next(new ErrorHandler("Please provide category"));
  }
  const images = await Image.find({ category: req.params.category }).populate(
    "owner",
    "name profile_pic"
  );

  if (!images) {
    return next(new ErrorHandler("Image not found or invalid category!"));
  }

  res.status(200).json({
    success: true,
    message: "Successfully fetched images",
    images,
  });
});

// get images of followed user
exports.getImagesOfFollowedUser = catchAsyncErrors(async (req, res, next) => {
  // Find the user and get their following user's id
  const user = await User.findById(req.user._id).populate(
    "following",
    "_id name profile_pic"
  );

  let images = [];

  if (user.following && user.following.length > 0) {
    // User has following users
    const users = [...new user.following.map((user) => user._id)];

    // Fetch images from those user
    images = await Image.find({
      owner: { $in: users },
    })
      .populate("owner", "name profile_pic")
      .limit(20); // Limit to a reasonable number
  } else {
    // User has not following user, fetch random images
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

// search api

exports.search = catchAsyncErrors(async (req, res) => {
  const { query = "", page = 1, limit = 10, type = "image" } = req.query;
  const requestingUserRole = req.user ? req.user.role : null;

  let searchCriteria = [];

  // Check if the search type is for 'user' or 'image'
  if (type === "user") {
    // If the user is a 'user', exclude super admins, admins, and moderators from the results
    if (requestingUserRole === "user") {
      searchCriteria.push({
        role: { $nin: ["superadmin", "admin", "moderator"] },
      });
    }

    // If search query exists, search by username, email, mobile No
    if (query) {
      searchCriteria.push({
        $or: [
          { username: { $regex: query, $options: "i" } }, // Case-insensitive search
          { email: { $regex: query, $options: "i" } },
          { mobileNo: { $regex: query } },
        ],
      });
    }

    // Combine search criteria using $and if there are any criteria
    const finalCriteria =
      searchCriteria.length > 0 ? { $and: searchCriteria } : {};

    // Get the total count of users matching the search criteria
    const totalUsers = await User.countDocuments(finalCriteria);

    // Find users with pagination
    const users = await User.find(finalCriteria)
      .skip((page - 1) * limit) // Skip previous pages
      .limit(parseInt(limit)); // Limit the results to the number specified in limit

    // If no users found
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send paginated response
    res.status(200).json({
      success: true,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } else if (type === "image") {
    // For images, you can define search criteria based on image title or other fields
    const imageSearchCriteria = query
      ? {
          title: { $regex: query, $options: "i" },
        }
      : {};

    // Get the total count of images matching the search criteria
    const totalImages = await Image.countDocuments(imageSearchCriteria);

    // Find images with pagination
    const images = await Image.find(imageSearchCriteria)
      .populate("owner", "_id name profile_pic")
      .skip((page - 1) * limit) // Skip previous pages
      .limit(parseInt(limit)); // Limit the results to the number specified in limit

    // If no images found
    if (images.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Send paginated response
    res.status(200).json({
      success: true,
      totalImages,
      currentPage: page,
      totalPages: Math.ceil(totalImages / limit),
      images,
    });
  } else {
    // If the 'type' parameter is invalid
    return res
      .status(400)
      .json({ message: "Invalid search type. Use 'user' or 'image'." });
  }
});

// ad banner
exports.getStaticText = catchAsyncErrors(async (req, res, next) => {
  const text = [""];
});
