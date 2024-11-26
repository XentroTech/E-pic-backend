const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Contact = require("../Models/contactModel");
const ErrorHandler = require("../utils/errorHandler");

exports.createContactMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new ErrorHandler("Please Provide all information"));
  }

  const newMessage = await Contact.create({
    user: req.user._id,
    name,
    email,
    message,
  });

  res.status(200).json({
    success: true,
    message: "Message has been sent to epic support team!",
    newMessage,
  });
});

exports.getUserMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Contact.find({});
  if (!messages) {
    return next(new ErrorHandler("Messages not found", 404));
  }
  res.status(200).json({
    success: true,
    messages,
  });
});
