// Cart Controller
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Cart = require("../Models/cartModel");
const User = require("../Models/userModel");
const Image = require("../Models/imageModel");
const { Identity } = require("twilio/lib/twiml/VoiceResponse");
// Add image to cart
exports.addToCart = catchAsyncErrors(async (req, res, next) => {
  const { imageId } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const image = await Image.findById(imageId);
  if (!image) {
    return next(new ErrorHandler("Image not found", 404));
  }

  // Check if image is already in the cart
  let cartItem = await Cart.findOne({ user: req.user._id, image: imageId });
  if (cartItem) {
    return next(new ErrorHandler("Image is already in the cart", 400));
  }

  // Add image to cart
  cartItem = new Cart({
    user: req.user._id,
    image: imageId,
  });

  await cartItem.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Image added to cart successfully",
    cartItem,
  });
});

// Get user's cart
exports.getCart = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Fetch all items in the user's cart
  const cartItems = await Cart.find({ user: req.user._id }).populate({
    path: "image",
    populate: { path: "owner", select: "name profile_pic" },
  });
  if (!cartItems || cartItems.length === 0) {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Your cart is empty",
      cartItems: [],
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    cartItems,
  });
});

// Remove image from cart
exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const cartItem = await Cart.findOne({ _id: req.params.id });
  if (!cartItem) {
    return next(new ErrorHandler("Cart Item not found in cart", 404));
  }

  await cartItem.deleteOne();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Item removed from cart successfully",
  });
});

// Clear cart
exports.clearCart = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await Cart.deleteMany({ user: req.user._id });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Cart cleared successfully",
  });
});
