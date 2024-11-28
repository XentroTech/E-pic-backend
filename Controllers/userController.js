const User = require("../Models/userModel");
const ErrorHandler = require("../utils/errorHandler.js");
const sendToken = require("../utils/jwtToken.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const fs = require("fs");
const sendEmail = require("../utils/sendEmail.js");
const processPayment = require("../utils/processPayment.js");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const Image = require("../Models/imageModel.js");
const BASE_URL = "http://localhost:300";

//register
exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, username, email, password, mobileNo, referralCode, country } =
    req.body;

  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorHandler(errors.array()[0].msg, 400));
  }

  if (!name || !username || !email || !password || !mobileNo || !country) {
    return next(new ErrorHandler("Please provide all information", 401));
  }

  let referredUser = null;

  // Set referral bonus
  if (referralCode) {
    referredUser = await User.findOne({ username: referralCode });
    if (referredUser) {
      const referralBonus =
        referredUser.referred_users_details.length < 3
          ? 10
          : referredUser.referred_users_details.length < 7
          ? 20
          : referredUser.referred_users_details.length < 10
          ? 30
          : 5;

      referredUser.wallet += referralBonus;
      referredUser.referred_users_details.push({
        user_email: email,
        referralBonus,
      });
      await referredUser.save();
    } else {
      return next(
        new ErrorHandler(
          "Your referral id is not valid. If you don't have a referral id, you can skip this step.",
          404
        )
      );
    }
  }

  // Create the new user
  const newUser = await User.create({
    name,
    username,
    email,
    password,
    mobileNo,
    referralCode,
    country,
    wallet: referralCode ? 5 : 0,
  });

  // If referred, add the new user to referredUser's list
  if (referredUser) {
    referredUser.referredUsers = referredUser.referredUsers || [];
    referredUser.referredUsers.push(newUser._id);
    await referredUser.save();
  }

  res.status(200).send({ success: true, newUser });
});

//login
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 401));
  }

  const user = await User.findOne({ email }).select("+password");

  // if user is deactivated then can't login
  if (!user.isActive) {
    return next(
      new ErrorHandler(
        "Your account has been deactivated Please contact with epic support team!",
        403
      )
    );
  }
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  sendToken(user, 200, res);
});

//logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({
    success: true,
    statusCode: 200,
    message: "Logout ",
  });
});

//forget password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found"), 403);
  }

  //get reset password otp
  const resetPasswordOtp = user.getForgetPasswordOtp();

  await user.save({ validateBeforeSave: false });

  const message = `
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <p style="font-size: 16px; color: #333333; line-height: 1.6;">Hello ${user.username},</p>

        <p style="font-size: 16px; color: #333333; line-height: 1.6;">
            We received a request to reset the password for your account. Please use the following OTP (One-Time Password) to reset your password:
        </p>

        <p style="font-size: 24px; color: #00674F; font-weight: bold; margin: 20px 0;">${resetPasswordOtp}</p>

        <p style="font-size: 16px; color: #333333; line-height: 1.6;">
            This OTP is valid for only 5 minutes. If you did not request a password reset, please ignore this email and your account will remain secure.
        </p>

        <p style="font-size: 14px; color: #888888; margin-top: 20px; line-height: 1.6;">
            Best regards, <br>
            Team E-pic
        </p>
    </div>
</body>
</html>

    `;

  try {
    await sendEmail({
      email: user.email,
      subject: `Epic Password Recovery`,
      message,
    });
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: `Email sent to ${user.email} successfully!`,
    });
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});
//reset password otp verify
exports.resetPasswordOtpVerify = catchAsyncErrors(async (req, res, next) => {
  const { otp } = req.body;
  //otp sanitization and validation
  if (!otp || !/^\d{6}$/.test(otp)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }
  const resetPasswordOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordOtp,
    resetPasswordOtpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Otp is invalid or has been expired"),
      400
    );
  }

  res.status(200).json({
    success: true,
    message: "Otp verified successfully",
  });
});
// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;
  const email = req.params.email;

  const errors = validationResult(req);

  // Check if there are validation errors
  if (!errors.isEmpty()) {
    // Log the first error message only if it exists
    console.log(
      errors.array().length > 0 ? errors.array()[0].msg : "Validation error"
    );
    return next(new ErrorHandler(errors.array()[0].msg, 400));
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  // Update password and clear reset fields
  user.password = password;
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpire = undefined;

  await user.save();

  // Send success response
  sendToken(user, 200, res);
});

//get all user
exports.getUsers = catchAsyncErrors(async (req, res) => {
  const { query = "", page = 1, limit = 10 } = req.query;
  const requestingUserRole = req.user ? req.user.role : null;

  let searchCriteria = [];

  // If the user is an admin, exclude superadmins and admins from the results
  if (requestingUserRole === "admin") {
    searchCriteria.push({ role: { $nin: ["superadmin", "admin"] } });
  }

  // If search query exists, search by username, email, or mobile
  if (query) {
    searchCriteria.push({
      $or: [
        { username: { $regex: query, $options: "i" } }, // Case-insensitive search
        { email: { $regex: query, $options: "i" } },
        { mobileNo: { $regex: query } },
      ],
    });
  }

  // Combine search criteria using $and if there are any criteria
  const finalCriteria =
    searchCriteria.length > 0 ? { $and: searchCriteria } : {};

  // Get the total count of users matching the search criteria
  const totalUsers = await User.countDocuments(finalCriteria);

  // Find users with pagination
  const users = await User.find(finalCriteria)
    .skip((page - 1) * limit) // Skip previous pages
    .limit(parseInt(limit)); // Limit the results to the number specified in limit

  // If no users found
  if (users.length === 0) {
    return res.status(404).json({ message: "user not found" });
  }

  // Send paginated response
  res.status(200).json({
    totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    users,
  });
});

//get a user
exports.getAUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).send({
    success: true,
    statusCode: 200,
    user,
  });
});

//update a user
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).send({
    success: true,
    user,
  });
});

// update user profile
exports.updateUserProfile = catchAsyncErrors(async (req, res) => {
  const userId = req.user.id;

  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.files) {
    if (req.files.profile_pic) {
      // Optionally, remove old profile pic if exists
      if (user.profile_pic) {
        fs.unlinkSync(user.profile_pic.replace(BASE_URL, ""));
      }
      // Add base URL and convert backslashes to forward slashes
      user.profile_pic =
        BASE_URL + req.files.profile_pic[0].path.replace(/\\/g, "/");
    }

    if (req.files.cover_pic) {
      // Optionally, remove old cover pic if exists
      if (user.cover_pic) {
        fs.unlinkSync(user.cover_pic.replace(BASE_URL, ""));
      }
      user.cover_pic =
        BASE_URL + req.files.cover_pic[0].path.replace(/\\/g, "/");
    }
  }

  // Update other fields (if needed)
  const { name, username, email, mobileNo, bio, country } = req.body;

  if (name) user.name = name;
  if (username) user.username = username;
  if (mobileNo) user.mobileNo = mobileNo;
  if (email) user.email = email;
  if (bio) user.bio = bio;
  if (country) user.country = country;

  // Save updated user data
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// update user role
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.body;
  if (!role) {
    return next(new ErrorHandler("User Role is Undefined", 404));
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: `User role updated successfully as ${role}`,
    updatedUser,
  });
});

// delete a user
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  //super admin id can't be deleted
  if (user.role === "superadmin") {
    return next(new ErrorHandler("Murubbi Murubbi uhuhu.."));
  }

  // deleting all images associated with the user
  const images = await Image.find({ owner: user._id });

  if (images.length > 0) {
    await Image.deleteMany({ owner: user._id });
  }

  await user.deleteOne();

  return res.status(203).json({
    success: true,
    statusCode: 200,
    message: "User Deleted Successfully!",
    user,
  });
});

// activate or deactivate user
exports.activeOrDeactivateUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return next(new ErrorHandler("user not found", 404));
  }
  const user = await User.findById(userId);
  if (user.isActive === true) {
    user.isActive = false;
  } else {
    user.isActive = true;
  }
  await user.save();
  res.status(200).send({
    success: true,
    userId,
    message: `User ${user.isActive ? "Activate" : "Deactivated"} Successful!`,
  });
});

// purchase coin
exports.purchaseCoin = catchAsyncErrors(async (req, res, next) => {
  const { coinBundle } = req.body;
  const user = await User.findById(req.user._id);

  let newCoin = 0;

  if (coinBundle === "50") {
    newCoin = 50;
  } else if (coinBundle === "100") {
    newCoin = 100;
  } else if (coinBundle === "500") {
    newCoin = 500;
  }

  const paymentSuccess = await processPayment(paymentDetails);

  if (paymentSuccess) {
    user.wallet += newCoin;
    await user.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Successfully purchased ${newCoin} coin`,
    });
  } else {
    return next(new ErrorHandler("payment not successful"));
  }
});

// follow/un-follow user
exports.followUser = catchAsyncErrors(async (req, res, next) => {
  const userToFollowId = req.params.id; // User to be followed/un-followed
  const currentUserId = req.user._id; // Current logged-in user
  const userToFollow = await User.findById(userToFollowId);
  const currentUser = await User.findById(currentUserId);
  // Check if both users exist
  if (!userToFollow || !currentUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  const alreadyFollowed = userToFollow.followers.includes(currentUserId);

  if (alreadyFollowed) {
    // Un-follow
    userToFollow.followers.pull(currentUserId);
    currentUser.following.pull(userToFollowId);
  } else {
    // Follow
    userToFollow.followers.push(currentUserId);
    currentUser.following.push(userToFollowId);
  }

  await userToFollow.save();
  await currentUser.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: alreadyFollowed ? "Un-followed the user" : "Followed the user",
  });
});

// get purchased images
exports.getPurchasedImages = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({
    path: "purchased_images.image",
    select: "image_url likes likesCount title bought_by",
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const purchasedImages = user.purchased_images.filter(
    (img) => !img.isUsedForGame
  );

  res.status(200).json({
    success: true,
    message: "Successfully fetched purchased images",
    purchasedImages,
  });
});

// user referral bonus details

exports.getReferralBonusDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  try {
    const referralBonus = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $unwind: {
          path: "$referred_users_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "referred_users_details.user_email",
          foreignField: "email",
          as: "user_details",
        },
      },
      {
        $project: {
          referralBonus: "$referred_users_details.referralBonus",
          referredUser: { $arrayElemAt: ["$user_details", 0] },
        },
      },
      {
        $group: {
          _id: "$_id",
          count: { $sum: 1 },
          totalEarnings: { $sum: "$referralBonus" },
          referredUsers: {
            $push: {
              profile_pic: "$referredUser.profile_pic",
              name: "$referredUser.name",
            },
          },
        },
      },
    ]);

    res.status(200).send({
      success: true,
      referralBonus,
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    return next(
      new ErrorHandler("Failed to fetch referral bonus details", 500)
    );
  }
});
