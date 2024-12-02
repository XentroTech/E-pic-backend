const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");

//get chart data
// exports.getChartData = catchAsyncErrors(async (req, res, next) => {
//   const { interval = "daily" } = req.query;

//   // Valid intervals
//   const validIntervals = ["daily", "weekly", "monthly", "yearly"];
//   if (!validIntervals.includes(interval)) {
//     return next(new ErrorHandler("Invalid interval provided", 400));
//   }

//   const userId = req.user._id;
//   //if user not found
//   if (!userId) {
//     return next(new ErrorHandler("User ID is required", 400));
//   }

//   const matchStage = { $match: { owner: userId } };
//   let groupStage;

//   // Set group stage based on the interval
//   switch (interval) {
//     case "daily":
//       groupStage = {
//         $group: {
//           _id: {
//             $dateToString: { format: "%H:00", date: "$sold_details.date" }, //daily as hours
//           },
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;

//     case "weekly":
//       groupStage = {
//         $group: {
//           _id: {
//             dayOfWeek: { $dayOfWeek: "$sold_details.date" }, // week as day
//           },
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;

//     case "monthly":
//       groupStage = {
//         $group: {
//           _id: { $dayOfMonth: "$sold_details.date" }, // month as day
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;

//     case "yearly":
//       groupStage = {
//         $group: {
//           _id: { $month: "$sold_details.date" }, // year as month
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;

//     default:
//       return next(new ErrorHandler("Invalid interval provided", 400));
//   }

//   try {
//     const chartData = await Image.aggregate([
//       { $unwind: "$sold_details" },
//       matchStage,
//       groupStage,
//       { $sort: { _id: 1 } },
//     ]);

//     // Prepare response data based on the interval
//     let formattedData;
//     switch (interval) {
//       case "daily": {
//         // Fill all 24 hours
//         const allHours = Array.from(
//           { length: 24 },
//           (_, i) => i.toString().padStart(2, "0") + ":00"
//         );
//         formattedData = allHours.map((hour) => {
//           const data = chartData.find((item) => item._id === hour);
//           return {
//             hour,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;
//       }

//       case "weekly": {
//         const daysOfWeek = [
//           "Sunday",
//           "Monday",
//           "Tuesday",
//           "Wednesday",
//           "Thursday",
//           "Friday",
//           "Saturday",
//         ];
//         formattedData = daysOfWeek.map((day, index) => {
//           const data = chartData.find(
//             (item) => item._id.dayOfWeek === index + 1
//           );
//           return {
//             day,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;
//       }

//       case "monthly": {
//         const daysInMonth = new Date(
//           new Date().getFullYear(),
//           new Date().getMonth() + 1,
//           0
//         ).getDate();
//         formattedData = Array.from({ length: daysInMonth }, (_, i) => {
//           const day = i + 1;
//           const data = chartData.find((item) => item._id === day);
//           return {
//             day,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;
//       }

//       case "yearly": {
//         const months = [
//           "January",
//           "February",
//           "March",
//           "April",
//           "May",
//           "June",
//           "July",
//           "August",
//           "September",
//           "October",
//           "November",
//           "December",
//         ];
//         formattedData = months.map((month, index) => {
//           const data = chartData.find((item) => item._id === index + 1);
//           return {
//             month,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;
//       }
//     }

//     res.status(200).json({
//       success: true,
//       interval,
//       date:
//         interval === "daily"
//           ? new Date().toISOString().split("T")[0]
//           : undefined,
//       chartData: formattedData,
//     });
//   } catch (error) {
//     return next(new ErrorHandler("Failed to fetch chart data", 500));
//   }
// });
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

  // Set group stage based on the interval
  switch (interval) {
    case "daily":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%H:00", date: "$sold_details.date" },
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
            dayOfWeek: { $dayOfWeek: "$sold_details.date" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$sold_details.price" },
        },
      };
      break;

    case "monthly":
      groupStage = {
        $group: {
          _id: { $dayOfMonth: "$sold_details.date" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$sold_details.price" },
        },
      };
      break;

    case "yearly":
      groupStage = {
        $group: {
          _id: { $month: "$sold_details.date" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$sold_details.price" },
        },
      };
      break;

    default:
      return next(new ErrorHandler("Invalid interval provided", 400));
  }

  try {
    // Aggregate data
    const chartData = await Image.aggregate([
      { $unwind: "$sold_details" },
      matchStage,
      groupStage,
      { $sort: { _id: 1 } },
      {
        $facet: {
          intervalData: [],
          totals: [
            {
              $group: {
                _id: null,
                totalCount: { $sum: "$count" },
                totalEarnings: { $sum: "$totalEarnings" },
              },
            },
          ],
        },
      },
    ]);

    const intervalData = chartData[0]?.intervalData || [];
    const totals = chartData[0]?.totals[0] || {
      totalCount: 0,
      totalEarnings: 0,
    };

    // Prepare response data
    let formattedData;
    switch (interval) {
      case "daily": {
        const allHours = Array.from(
          { length: 12 },
          (_, i) => `${i === 0 ? 12 : i} AM`
        ).concat(
          Array.from({ length: 12 }, (_, i) => `${i === 0 ? 12 : i} PM`)
        );

        formattedData = allHours.map((hour, index) => {
          const data = intervalData.find((item) => {
            const hourInt = parseInt(item._id.split(":")[0], 10);
            return (
              hourInt ===
              (index === 0 ? 12 : index % 12) + (index >= 12 ? 12 : 0)
            );
          });
          return {
            hour,
            count: data ? data.count : 0,
            totalEarnings: data ? data.totalEarnings : 0,
          };
        });
        break;
      }

      case "weekly": {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        formattedData = daysOfWeek.map((day, index) => {
          const data = intervalData.find(
            (item) => item._id.dayOfWeek === index + 1
          );
          return {
            day,
            count: data ? data.count : 0,
            totalEarnings: data ? data.totalEarnings : 0,
          };
        });
        break;
      }

      case "monthly": {
        const daysInMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();
        formattedData = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const data = intervalData.find((item) => item._id === day);
          return {
            day,
            count: data ? data.count : 0,
            totalEarnings: data ? data.totalEarnings : 0,
          };
        });
        break;
      }

      case "yearly": {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        formattedData = months.map((month, index) => {
          const data = intervalData.find((item) => item._id === index + 1);
          return {
            month,
            count: data ? data.count : 0,
            totalEarnings: data ? data.totalEarnings : 0,
          };
        });
        break;
      }
    }

    res.status(200).json({
      success: true,
      interval,
      date:
        interval === "daily"
          ? new Date().toISOString().split("T")[0]
          : undefined,
      chartData: formattedData,
      totals: {
        totalCount: totals.totalCount,
        totalEarnings: totals.totalEarnings,
      },
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

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const today = new Date();

  // Helper functions for start and end of the week
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

  try {
    const targets = [];
    const targetAchievedPercentages = [];
    const weeklySales = [];
    let totalPercentage = 0;

    for (let i = 0; i < 4; i++) {
      const start = startOfWeek(today, i);
      const end = endOfWeek(today, i);

      // Fetch sales data for the specific week
      const salesData = await Image.aggregate([
        { $unwind: "$sold_details" },
        {
          $match: {
            "sold_details.date": { $gte: start, $lte: end },
            owner: userId,
          },
        },
        {
          $group: {
            _id: null,
            weeklySales: { $sum: 1 },
          },
        },
      ]);

      const salesCount = salesData[0]?.weeklySales || 0;

      const target =
        i === 0
          ? // Default target if no sales
            Math.max(salesCount || 5, 5)
          : // Increment target by 10%
            Math.ceil(Math.max(targets[i - 1], salesCount) * 1.1);

      targets.unshift(target);
      weeklySales.unshift(salesCount);

      // Calculate percentage of target achieved
      const percentage =
        salesCount > 0 ? Math.min((salesCount / target) * 100, 100) : 0;
      targetAchievedPercentages.unshift(Math.floor(percentage));

      // Update total percentage for average calculation
      totalPercentage += percentage;
    }

    // Calculate average target achievement
    const averageTargetAchievement = Math.floor(totalPercentage / 4);

    res.status(200).json({
      success: true,
      graphData: {
        weeks: ["First Week", "Second Week", "Third Week", "Fourth Week"],
        targets,
        sales: weeklySales.map((sales, index) => ({
          week: `Week ${index + 1}`,
          sales,
        })),
        targetAchievedPercentages,
      },
      averageTargetAchievement,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to fetch weekly target graph", 500));
  }
});
