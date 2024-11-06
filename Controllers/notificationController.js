// controllers/notificationController.js
const axios = require("axios");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const sendNotification = catchAsyncErrors(async (user, title, body) => {
  const fcmToken = user.fcmToken;

  const message = {
    to: fcmToken,
    notification: {
      title: title,
      body: body,
    },
  };

  const config = {
    headers: {
      Authorization: `key=${process.env.FIREBASE_SERVER_KEY}`,
      "Content-Type": "application/json",
    },
  };

  await axios.post("https://fcm.googleapis.com/fcm/send", message, config);
});

exports.remindCompetition = catchAsyncErrors(
  async (user, competitionDetails) => {
    const message = `Reminder: The competition "${competitionDetails.name}" starts soon. Get ready!`;
    await sendNotification(user, "Competition Reminder", message);
  }
);

exports.notifyCompetitionJoined = catchAsyncErrors(
  async (user, competitionDetails) => {
    const message = `You have successfully joined the competition "${competitionDetails.name}". Best of luck!`;
    await sendNotification(user, "Competition Joined", message);
  }
);

exports.announceWinner = catchAsyncErrors(async (winnerUser) => {
  const message = `Congratulations! You won today's competition.`;
  await sendNotification(winnerUser, "Winner Announcement", message);
});

exports.notifyWalletUpdate = catchAsyncErrors(async (user, coinReward) => {
  const message = `Your wallet has been updated with ${coinReward} PicCoins!`;
  await sendNotification(user, "Wallet Update", message);
});

exports.notifyPurchase = catchAsyncErrors(async (user, purchaseDetails) => {
  const message = `Your purchase of ${purchaseDetails.itemName} was successful!`;
  await sendNotification(user, "Purchase Successful", message);
});

exports.sendModerationWarning = catchAsyncErrors(
  async (user, warningMessage) => {
    const message = `Warning: ${warningMessage}`;
    await sendNotification(user, "Moderation Warning", message);
  }
);
