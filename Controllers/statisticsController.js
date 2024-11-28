const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");

//get chart data
exports.getChartData = catchAsyncErrors(async (req, res, next) => {
  const { interval = "daily" } = req.query;

  // checking valid intervals
  const validIntervals = ["daily", "weekly", "monthly", "yearly"];
  if (!validIntervals.includes(interval)) {
    return next(new ErrorHandler("Invalid interval provided", 400));
  }

  const userId = req.user._id;
  //if user not found
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const matchStage = { $match: { owner: userId } };
  let groupStage;

  //checking interval inputs and creating group data
  switch (interval) {
    case "daily":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$sold_details.date" }, //daily as date
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
            $dateToString: { format: "%Y-%U", date: "$sold_details.date" }, //weekly as date
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
            $dateToString: { format: "%Y-%m", date: "$sold_details.date" }, //month as date
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
            $dateToString: { format: "%Y", date: "$sold_details.date" }, // month as yearly
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
    //fetching data from image model as match and group stage
    const chartData = await Image.aggregate([
      { $unwind: "$sold_details" },

      matchStage,
      groupStage,
    ]);

    //extracting data from response
    const totalSold = chartData[0]?.count || 0;
    const totalEarning = chartData[0]?.totalEarnings || [];
    res.status(200).send({
      success: true,
      interval,
      chartData,
      totalSold,
      totalEarning,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch chart data", 500));
  }
});

// get sold images
exports.getSoldImages = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  // if user not found
  if (!userId) {
    return next(new ErrorHandler("User not found", 404));
  }

  // fetching images by filtering as sold_count and populating owner
  const soldImages = await Image.aggregate([
    {
      $match: {
        owner: req.user._id,
        sold_count: { $gte: 1 },
      },
    },
    {
      $sort: { sold_count: -1 },
    },

    // Project the required fields for the owner and image
    {
      $project: {
        title: 1,
        image_url: 1,
        sold_count: 1,
        uploaded_at: 1,
      },
    },
  ]);

  // if no sold images found
  if (!soldImages || soldImages.length === 0) {
    return next(
      new ErrorHandler("Image not found or image has not been sold yet", 400)
    );
  }

  res.status(200).json({
    success: true,
    soldImages,
  });
});

// target graph
exports.getWeeklyTargetGraph = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  //if user not found
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const today = new Date();
  //function for set starting date of the week
  const startOfWeek = (date, weeksAgo) => {
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay() - weeksAgo * 7);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  //function for set end date of the week
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
          week: {
            $dateToString: { format: "%Y-%U", date: "$sold_details.date" },
          },
          year: { $dateToString: { format: "%Y", date: "$sold_details.date" } },
        },
        weeklySales: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.week": -1 },
    },
  ]);
  // console.log(salesData[0].weeklySale);
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
    // const salesCount = salesData[0].weeklySale;
    // console.log(salesCount);
    // console.log(salesData[0].weeklySale);
    // Assign target for the current week
    let target;
    if (i === 0) {
      target = randomTarget;
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
