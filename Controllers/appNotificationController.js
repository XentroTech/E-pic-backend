const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const AppNotification = require("../Models/appNotificationModel");
const User = require("../Models/userModel");
const ErrorHandler = require("../utils/errorHandler");

exports.sendNotification = catchAsyncErrors(async (req, res, next) => {
  const { title, message } = req.body;
  const users = await User.find({});
  if (!users) {
    return next(new ErrorHandler("user not found", 404));
  }
  users.map(async (user) => {
    await AppNotification.create({
      user: user._id,
      title: title,
      message: message,
    });
  });

  res.status(200).json({
    success: true,
    message: "Notification has been send to users",
  });
});

exports.getAllNotification = catchAsyncErrors(async (req, res, next) => {
  const notifications = await AppNotification.find({});
  if (!notifications) {
    return next(new ErrorHandler("Notification not found", 404));
  }
  res.status(200).send({
    success: true,
    message: "successfully fetched notifications",
    notifications,
  });
});

exports.getUserNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await AppNotification.find({ user: req.user._id }).sort(
    { createdAt: -1 }
  );
  if (!notifications) {
    return next(new ErrorHandler("Notifications not found", 404));
  }
  res.status(200).send({
    success: true,
    message: "successfully fetched notifications",
    notifications,
  });
});
