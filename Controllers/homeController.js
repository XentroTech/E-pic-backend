const Image = require("../Models/imageModel");
const User = require("../Models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");

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
  const categoryName = req.params;

  const images = await Image.find({ category: categoryName }).populate(
    "owner",
    "name profile_pic"
  );

  if (!images) {
    return next(new ErrorHandler("Images not found!"));
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
    console.log("Final Criteria:", JSON.stringify(finalCriteria, null, 2));

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
exports.createAdBanner = catchAsyncErrors(async (req, res, next) => {});

//get chart data
exports.getChartData = catchAsyncErrors(async (req, res, next) => {
  const { interval = "daily" } = req.query;

  const validIntervals = ["daily", "weekly", "monthly", "yearly"];
  if (!validIntervals.includes(interval)) {
    return next(new ErrorHandler("Invalid interval provided", 400));
  }

  const userId = req.user._id;
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const matchStage = { $match: { owner: userId } };
  let groupStage;

  switch (interval) {
    case "daily":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$sold_details.date" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$sold_details.price" },
        },
      };
      break;
    case "weekly":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%U", date: "$sold_details.date" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$sold_details.price" },
        },
      };
      break;
    case "monthly":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$sold_details.date" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$sold_details.price" },
        },
      };
      break;
    case "yearly":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%Y", date: "$sold_details.date" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$sold_details.price" },
        },
      };
      break;
    default:
      return next(new ErrorHandler("Invalid interval provided", 400));
  }

  try {
    const chartData = await Image.aggregate([
      { $unwind: "$sold_details" },

      matchStage,
      groupStage,
    ]);

    const totalSold = chardData[0]?.count || 0;
    const totalEarning = chardData[0]?.totalEarnings || [];
    res.status(200).send({
      success: true,
      interval,
      chartData,
      totalSold,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch chart data", 500));
  }
});

//weekly target graph
exports.getWeeklyTargetGraph = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const today = new Date();
  const startOfWeek = (date, weeksAgo) => {
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay() - weeksAgo * 7);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const endOfWeek = (date, weeksAgo) => {
    const result = new Date(startOfWeek(date, weeksAgo));
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
  };

  // Fetch sales data for the past 4 weeks
  const salesData = await Image.aggregate([
    { $unwind: "$sold_details" },
    { $match: { "sold_details.date": { $exists: true }, owner: userId } },
    {
      $group: {
        _id: {
          week: { $isoWeek: "$sold_details.date" },
          year: { $isoYear: "$sold_details.date" },
        },
        weeklySales: { $sum: 1 }, // Count of sales
      },
    },
    {
      $sort: { "_id.year": -1, "_id.week": -1 },
    },
  ]);

  const targets = [];
  const targetAchievedPercentages = [];
  // Random initial target (5-10)
  let randomTarget = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
  let averageTargetAchievement = 0;

  for (let i = 0; i < 4; i++) {
    const start = startOfWeek(today, i);
    const end = endOfWeek(today, i);

    const weeklySale = salesData.find(
      (weekData) =>
        new Date(weekData._id.year, 0, 1 + (weekData._id.week - 1) * 7) >=
          start &&
        new Date(weekData._id.year, 0, 1 + (weekData._id.week - 1) * 7) <= end
    );

    const salesCount = weeklySale ? weeklySale.weeklySales : 0;

    // Assign target for the current week
    let target;
    if (i === 0) {
      target = randomTarget; // First week's target is random
    } else {
      const lastWeekSales =
        targets[i - 1] < salesCount ? salesCount : targets[i - 1];
      // Increment by 10% of last week's actual sales or target
      target = Math.ceil(lastWeekSales * 1.1);
    }

    targets.unshift(target);

    // Calculate percentage of target fulfilled
    const percentage =
      salesCount > 0 ? Math.min((salesCount / target) * 100, 100) : 0;
    targetAchievedPercentages.unshift(percentage);

    // Update average target achievement
    averageTargetAchievement += percentage;
  }

  // Calculate final average target fulfillment
  averageTargetAchievement /= 4;

  res.status(200).send({
    success: true,
    graphData: {
      weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
      targets,
      sales: salesData.slice(0, 4).map((data) => data.weeklySales || 0),
      targetAchievedPercentages,
    },
    averageTargetAchievement: averageTargetAchievement.toFixed(2),
  });
});
