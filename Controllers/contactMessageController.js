const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ContactMessage = require("../Models/contactMessageModel");
const ErrorHandler = require("../utils/errorHandler");

exports.createContactMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new ErrorHandler("Please Provide all information"));
  }

  const newMessage = await ContactMessage.create({
    user: req.user._id,
    name,
    email,
    message,
    country: req.user.country,
  });

  res.status(200).json({
    success: true,
    message: "Message has been sent to epic support team!",
    newMessage,
  });
});

exports.getUserMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await ContactMessage.find({
    country: req.user.country,
  }).sort({ date: -1 });
  if (!messages) {
    return next(new ErrorHandler("Messages not found", 404));
  }
  res.status(200).json({
    success: true,
    messages,
  });
});
exports.deleteUserMessages = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params.id;
  const message = await ContactMessage.findById(userId);
  if (!message) {
    return next(new ErrorHandler("Messages not found", 404));
  }

  await message.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message has been deleted",
  });
});

exports.isReadMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await ContactMessage.findById(id);
  if (!message) {
    return next(new ErrorHandler("message not found", 404));
  }
  message.isRead = true;
  await message.save();
  res.status(200).json({
    success: true,
    message: "message has been seen",
  });
});
