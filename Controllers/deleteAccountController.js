const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const DeleteAccount = require("../Models/deleteAccountModel");
const ErrorHandler = require("../utils/errorHandler");

// create request
exports.createDeleteAccountRequest = catchAsyncErrors(
  async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const request = await DeleteAccount.create({
      name: user.name,
      username: user.username,
      email: user.email,
      image_url: user.profile_pic,
    });
    res.status(200).json({
      success: true,
      message: "User Delete Request Created",
      request,
    });
  }
);

// get user Delete Request
exports.getUserDeleteRequest = catchAsyncErrors(async (req, res, next) => {
  const requests = await DeleteAccount.find({});
  if (!requests) {
    return next(new ErrorHandler("Request Not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "successfully fetched requests",
    requests,
  });
});

// approve request
exports.approveDeleteAccountRequest = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params;
    const request = await DeleteAccount.findById(id);

    if (!request) {
      return next(new ErrorHandler("Request not found", 404));
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Account has been deleted",
      request,
    });
  }
);

//decline request
exports.declineRequest = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  const request = await DeleteAccount.findById(id);

  if (!request) {
    return next(new ErrorHandler("request not found", 404));
  }

  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: "Account delete request has been declined",
  });
});
