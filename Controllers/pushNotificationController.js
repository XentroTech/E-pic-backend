const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const admin = require("firebase-admin");
const User = require("../Models/userModel");
exports.sendPushNotification = catchAsyncErrors(async (req, res, next) => {
  const { title, msg } = req.body;
  console.log(title, msg);
  // Validate incoming data
  if (!title || !msg) {
    return next(new ErrorHandler("Please provide title, and Message.", 400));
  }

  const users = await User.find({ country: req.user.country });
  if (!users) {
    return next(new ErrorHandler("user not found", 404));
  }
  users.map(async (user) => {
    const message = {
      token: user.fcmToken,
      notification: {
        title: title,
        body: msg,
      },
    };
    await admin.messaging().send(message);
  });

  res.status(200).json({
    success: true,
    message: "Push notification sent successfully.",
  });
});

// exports.remindCompetition = catchAsyncErrors(
//   async (user, competitionDetails) => {
//     const message = `Reminder: The competition "${competitionDetails.name}" starts soon. Get ready!`;
//     await sendNotification(user, "Competition Reminder", message);
//   }
// );

// exports.notifyCompetitionJoined = catchAsyncErrors(
//   async (user, competitionDetails) => {
//     const message = `You have successfully joined the competition "${competitionDetails.name}". Best of luck!`;
//     await sendNotification(user, "Competition Joined", message);
//   }
// );

// exports.announceWinner = catchAsyncErrors(async (winnerUser) => {
//   const message = `Congratulations! You won today's competition.`;
//   await sendNotification(winnerUser, "Winner Announcement", message);
// });

// exports.notifyWalletUpdate = catchAsyncErrors(async (user, coinReward) => {
//   const message = `Your wallet has been updated with ${coinReward} PicCoins!`;
//   await sendNotification(user, "Wallet Update", message);
// });

// exports.notifyPurchase = catchAsyncErrors(async (user, purchaseDetails) => {
//   const message = `Your purchase of ${purchaseDetails.itemName} was successful!`;
//   await sendNotification(user, "Purchase Successful", message);
// });

// exports.sendModerationWarning = catchAsyncErrors(
//   async (user, warningMessage) => {
//     const message = `Warning: ${warningMessage}`;
//     await sendNotification(user, "Moderation Warning", message);
//   }
// );
// // exports.sendPushNotification = catchAsyncErrors(async (req, res, next) => {
// //   const { title, msg } = req.body;
// //   if (!title || !msg) {
// //     return next(new ErrorHandler("please provide title and msg"));
// //   }

// //   const message = {
// //     to: req.user.fcmToken,
// //     notification: {
// //       title: title,
// //       body: msg,
// //     },
// //   };

// //   const config = {
// //     headers: {
// //       Authorization: `key=${process.env.FIREBASE_SERVER_KEY}`,
// //       "Content-Type": "application/json",
// //     },
// //   };

// //   await axios.post("https://fcm.googleapis.com/fcm/send", message, config);

// //   res.status(200).json({
// //     success: true,
// //     message: "push notification has been sent",
// //   });
// // });
