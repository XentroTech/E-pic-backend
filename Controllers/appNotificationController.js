const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const AppNotification = require("../Models/appNotificationModel");
const User = require("../Models/userModel");
const ErrorHandler = require("../utils/errorHandler");

// send notification to users
exports.sendNotification = catchAsyncErrors(async (req, res, next) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return next(new ErrorHandler("Please provide title and message", 400));
  }
  const users = await User.find({});
  if (!users) {
    return next(new ErrorHandler("user not found", 404));
  }
  users.map(async (user) => {
    await AppNotification.create({
      user: user._id,
      title: title,
      message: message,
      country: req.user.country,
    });
  });

  res.status(200).json({
    success: true,
    message: "Notification has been send to users",
  });
});
//get all notifications
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

// get user's notification
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

// notification seen unseen
exports.notificationSeenUnseen = catchAsyncErrors(async (req, res, next) => {
  const notification = await AppNotification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("notification not found", 404));
  }

  if (notification.isSeen) {
    notification.isSeen = false;
  } else {
    notification.isSeen = true;
  }
  await notification.save();
  res.status(200).json({
    success: true,
    message: `${
      notification.isSeen
        ? "Notification has been seen"
        : "Notification has been unseen"
    }`,
  });
});
