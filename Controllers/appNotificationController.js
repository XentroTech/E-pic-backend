const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.sendNotification = catchAsyncErrors(async (req, res, next) => {
  const { title, message } = req.body;
  const user = req.user;
});
