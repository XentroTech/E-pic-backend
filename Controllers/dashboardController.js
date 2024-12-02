const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Coin = require("../Models/coinModel");
const ImageSpace = require("../Models/imageSpaceInfoModel");
const Image = require("../Models/imageModel");

exports.getDashboardData = catchAsyncErrors(async (req, res, next) => {
  const { interval = "daily" } = req.query;
  const now = new Date();
  let startDate;

  switch (interval) {
    case "daily":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "weekly":
      const firstDayOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.setDate(firstDayOfWeek));
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      throw new Error("Invalid interval provided");
  }

  const endDate = new Date();

  // Image Selling Revenue
  const imageRevenue = await Image.aggregate([
    { $unwind: "$sold_details" },
    { $match: { "sold_details.date": { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: "$sold_details.price" } } },
  ]);

  // space Revenue
  const spaceRevenue = await ImageSpace.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);
  // Coin Revenue
  const coinRevenue = await Coin.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  const totalEarnings =
    (imageRevenue[0]?.total || 0) +
    (spaceRevenue[0]?.total || 0) +
    (coinRevenue[0]?.total || 0);

  res.status(200).send({
    success: true,
    totalEarnings,
    imageRevenue,
    spaceRevenue,
    coinRevenue,
  });
});

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
//     const imageRevenue = await Image.aggregate([
//       { $unwind: "$sold_details" },
//       { $match: { "sold_details.date": { $gte: startDate, $lte: endDate } } },
//       groupStage,
//       { $sort: { _id: 1 } },
//     ]);
//     const spaceRevenue = await ImageSpace.aggregate([
//       { $match: { date: { $gte: startDate, $lte: endDate } } },
//       groupStage,
//       { $sort: { _id: 1 } },
//     ]);

//     // Coin Revenue
//     const coinRevenue = await Coin.aggregate([
//       { $match: { date: { $gte: startDate, $lte: endDate } } },
//       groupStage,
//       // { $group: { _id: null, total: { $sum: "$price" } } },
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

exports.getExpenses = catchAsyncErrors(async (req, res, next) => {
  const { interval } = req.body;
  const now = new Date();
  let startDate;
  if (interval === "daily") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
  } else if (interval === "weekly") {
    const firstDayOfWeek = now.getDate() - now.getDay();
    startDate = new Date(now.setDate(firstDayOfWeek));
  } else if (interval === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (interval === "yearly") {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  const endDate = new Date();

  // Physical prizes
  const physicalPrizeExpenses = await Prize.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        type: "physical",
      },
    },
    { $group: { _id: null, total: { $sum: "$value" } } },
  ]);

  // Coin prizes
  const coinPrizeExpenses = await Prize.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate },
        type: "coin",
      },
    },
    { $group: { _id: null, total: { $sum: "$value" } } },
  ]);

  const totalExpenses =
    (physicalPrizeExpenses[0]?.total || 0) + (coinPrizeExpenses[0]?.total || 0);

  res.status(200).json({
    success: true,
    totalExpenses,
  });
});
