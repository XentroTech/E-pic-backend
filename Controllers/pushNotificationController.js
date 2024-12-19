const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const admin = require("firebase-admin");
const User = require("../Models/userModel");

// send push notification to all user
exports.sendPushNotification = catchAsyncErrors(async (req, res, next) => {
  const { title, msg } = req.body;

  // Validate incoming data
  if (!title || !msg) {
    return next(new ErrorHandler("Please provide title, and Message.", 400));
  }

  const users = await User.find({ country: req.user.country });

  if (users.length === 0) {
    return next(
      new ErrorHandler("No users found in the specified country.", 404)
    );
  }
  // Wait for all notifications to be sent
  await Promise.all(
    users.map(async (user) => {
      const message = {
        token: user.fcmToken,
        notification: {
          title: title,
          body: msg,
        },
      };

      try {
        await admin.messaging().send(message);
      } catch (error) {
        console.log(`Error sending notification to user ${user._id}:`, error);
        // Optionally, you can mark the token as invalid in the database and remove or update it.
      }
    })
  );

  res.status(200).json({
    success: true,
    message: "Push notification sent successfully.",
  });
});
