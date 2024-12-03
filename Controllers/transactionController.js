const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Transaction = require("../Models/transactionModal");
const ErrorHandler = require("../utils/errorHandler");

exports.getTransactions = catchAsyncErrors(async (req, res, next) => {
  const transactions = await Transaction.find({}).sort({ createdAt: 1 });
  if (!transactions) {
    return next(new ErrorHandler("transaction not found", 404));
  }

  res.status(200).json({
    success: true,
    transactions,
  });
});
