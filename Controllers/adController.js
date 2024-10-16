// controllers/adController.js
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/User');

exports.rewardUserForAd = catchAsyncErrors(async (req, res) => {
    const { userId, rewardAmount } = req.body;

    const user = await User.findById(userId);
    user.wallet += rewardAmount;

    await user.save();
    res.status(200).json({ message: `${rewardAmount} Picoins added to your account!` });
});

