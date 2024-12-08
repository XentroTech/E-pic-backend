const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Transaction = require("../Models/transactionModal");
const ImageSpace = require("../Models/imageSpaceInfoModel");
const Image = require("../Models/imageModel");
const ErrorHandler = require("../utils/errorHandler");
const Prize = require("../Models/prizeModel");
const Coin = require("../Models/coinModel");
const getDateRange = require("../utils/getDateRange");

//image revenue
// exports.getImageRevenue = catchAsyncErrors(async (req, res, next) => {
//   const { interval = "daily" } = req.query;

//   const validIntervals = ["daily", "weekly", "monthly", "yearly"];
//   if (!validIntervals.includes(interval)) {
//     return next(new ErrorHandler("Invalid interval provided", 400));
//   }

//   // Determine time range based on interval
//   const now = new Date();
//   let startDate, endDate;

//   switch (interval) {
//     case "daily":
//       // Start of today
//       startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       endDate = new Date(startDate);
//       // Start of the next day
//       endDate.setDate(endDate.getDate() + 1);
//       break;

//     case "weekly":
//       startDate = new Date(now);
//       // Start of the current week (Sunday)
//       startDate.setDate(now.getDate() - now.getDay());
//       startDate.setHours(0, 0, 0, 0);
//       endDate = new Date(startDate);
//       // End of the current week
//       endDate.setDate(startDate.getDate() + 7);
//       break;

//     case "monthly":
//       // Start of the current month
//       startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//       // Start of the next month
//       endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//       break;

//     case "yearly":
//       // Start of the current year
//       startDate = new Date(now.getFullYear(), 0, 1);
//       // Start of the next year
//       endDate = new Date(now.getFullYear() + 1, 0, 1);
//       break;

//     default:
//       return next(new ErrorHandler("Invalid interval provided", 400));
//   }

//   const matchStage = {
//     $match: {
//       "sold_details.date": { $gte: startDate, $lt: endDate },
//     },
//   };

//   let groupStage;

//   // Set group stage based on the interval
//   switch (interval) {
//     case "daily":
//       groupStage = {
//         $group: {
//           _id: {
//             $dateToString: { format: "%H:00", date: "$sold_details.date" },
//           },
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;

//     case "weekly":
//       groupStage = {
//         $group: {
//           _id: { $dayOfWeek: "$sold_details.date" },
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;

//     case "monthly":
//       groupStage = {
//         $group: {
//           _id: { $dayOfMonth: "$sold_details.date" },
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;

//     case "yearly":
//       groupStage = {
//         $group: {
//           _id: { $month: "$sold_details.date" },
//           count: { $sum: 1 },
//           totalEarnings: { $sum: "$sold_details.price" },
//         },
//       };
//       break;
//   }

//   try {
//     // Aggregate data
//     const chartData = await Image.aggregate([
//       { $unwind: "$sold_details" },
//       matchStage,
//       groupStage,
//       { $sort: { _id: 1 } },
//       {
//         $facet: {
//           intervalData: [],
//           totals: [
//             {
//               $group: {
//                 _id: null,
//                 totalCount: { $sum: "$count" },
//                 totalEarnings: { $sum: "$totalEarnings" },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const intervalData = chartData[0]?.intervalData || [];
//     const totals = chartData[0]?.totals[0] || {
//       totalCount: 0,
//       totalEarnings: 0,
//     };

//     // Prepare response data
//     let formattedData;
//     switch (interval) {
//       case "daily":
//         const allHours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
//         formattedData = allHours.map((hour) => {
//           const data = intervalData.find((item) => item._id === hour);
//           return {
//             hour,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;

//       case "weekly":
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
//           const data = intervalData.find((item) => item._id === index + 1);
//           return {
//             day,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;

//       case "monthly":
//         const daysInMonth = new Date(
//           now.getFullYear(),
//           now.getMonth() + 1,
//           0
//         ).getDate();
//         formattedData = Array.from({ length: daysInMonth }, (_, i) => {
//           const day = i + 1;
//           const data = intervalData.find((item) => item._id === day);
//           return {
//             day,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;

//       case "yearly":
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
//           const data = intervalData.find((item) => item._id === index + 1);
//           return {
//             month,
//             count: data ? data.count : 0,
//             totalEarnings: data ? data.totalEarnings : 0,
//           };
//         });
//         break;
//     }

//     res.status(200).json({
//       success: true,
//       interval,
//       date: now.toISOString().split("T")[0],
//       chartData: formattedData,
//       totals: {
//         totalCount: totals.totalCount,
//         totalEarnings: totals.totalEarnings,
//       },
//     });
//   } catch (error) {
//     return next(new ErrorHandler("Failed to fetch chart data", 500));
//   }
// });
exports.getImageRevenue = catchAsyncErrors(async (req, res, next) => {
  const { interval = "daily" } = req.query;

  const validIntervals = ["daily", "weekly", "monthly", "yearly"];
  if (!validIntervals.includes(interval)) {
    return next(new ErrorHandler("Invalid interval provided", 400));
  }

  const userId = req.user._id;
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }
  const { startDate, endDate } = getDateRange(interval);
  const matchStage = {
    $match: {
      country: req.user.country,
      type: "image",
      createdAt: { $gte: startDate, $lte: endDate },
    },
  };
  let groupStage;

  // Set group stage based on the interval
  switch (interval) {
    case "daily":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%H:00", date: "$createdAt" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "weekly":
      groupStage = {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: "$createdAt" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "monthly":
      groupStage = {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "yearly":
      groupStage = {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    default:
      return next(new ErrorHandler("Invalid interval provided", 400));
  }

  try {
    // Aggregate data
    const chartData = await Transaction.aggregate([
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
//space revenue
exports.getSpaceRevenue = catchAsyncErrors(async (req, res, next) => {
  const { interval = "daily" } = req.query;

  const validIntervals = ["daily", "weekly", "monthly", "yearly"];
  if (!validIntervals.includes(interval)) {
    return next(new ErrorHandler("Invalid interval provided", 400));
  }

  const userId = req.user._id;
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const { startDate, endDate } = getDateRange(interval);

  const matchStage = {
    $match: {
      country: req.user.country,
      item: "space",
      createdAt: { $gte: startDate, $lte: endDate },
    },
  };
  let groupStage;

  // Set group stage based on the interval
  switch (interval) {
    case "daily":
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%H:00", date: "$createdAt" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "weekly":
      groupStage = {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: "$createdAt" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "monthly":
      groupStage = {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "yearly":
      groupStage = {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    default:
      return next(new ErrorHandler("Invalid interval provided", 400));
  }

  try {
    // Aggregate data
    const chartData = await Transaction.aggregate([
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
//coin revenue
exports.getCoinRevenue = catchAsyncErrors(async (req, res, next) => {
  const { interval = "daily" } = req.query;

  const validIntervals = ["daily", "weekly", "monthly", "yearly"];
  if (!validIntervals.includes(interval)) {
    return next(new ErrorHandler("Invalid interval provided", 400));
  }

  const userId = req.user._id;
  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const { startDate, endDate } = getDateRange(interval);

  const matchStage = {
    $match: {
      country: req.user.country,
      item: "coin",
      createdAt: { $gte: startDate, $lte: endDate },
    },
  };
  let groupStage;

  switch (interval) {
    case "daily":
      // (matchStage = {
      //   $match: { createdAt: { $gte: startOfday, $lte: endOfDay } },
      // }),
      groupStage = {
        $group: {
          _id: {
            $dateToString: { format: "%H:00", date: "$createdAt" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "weekly":
      groupStage = {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: "$createdAt" },
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "monthly":
      groupStage = {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    case "yearly":
      groupStage = {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          totalEarnings: { $sum: "$price" },
        },
      };
      break;

    default:
      return next(new ErrorHandler("Invalid interval provided", 400));
  }

  try {
    // Aggregate data
    const chartData = await Transaction.aggregate([
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
