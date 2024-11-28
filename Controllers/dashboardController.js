const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Coin = require("../Models/coinModel");
const Sponsor = require("../Models/sponsorshipModel");


exports.getEarning = catchAsyncErrors(async(req, res, next)=>{
    const {interval} = req.body;
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
  
    // Ad Revenue
    const adRevenue = await Sponsor.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    // Coin Revenue
    const coinRevenue = await Coin.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
  
    const totalEarnings =
      (imageRevenue[0]?.total || 0) +
      (adRevenue[0]?.total || 0) +
      (coinRevenue[0]?.total || 0);
  
    res.status(200).send({
        success:true,
        totalEarnings
  
})

exports.getExpenses = catchAsyncErrors(async(req, res, next)=>{
    const {interval} = req.body;
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
          (physicalPrizeExpenses[0]?.total || 0) +
          (coinPrizeExpenses[0]?.total || 0);
      
        res.status(200).json({
            success:true,
            totalExpenses
        })
      
})