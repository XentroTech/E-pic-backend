const AppNotification = require("../Models/appNotificationModel");
const Image = require("../Models/imageModel");
const User = require("../Models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const processPayment = require("../utils/processPayment");
const path = require("path");
const BASE_URL = "http://dev.e-pic.co/";
const Transaction = require("../Models/transactionModal");
//upload photo
exports.uploadPhoto = catchAsyncErrors(async (req, res, next) => {
  const imageCount = req.files.length;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }
  if (imageCount > user.image_limit) {
    return next(
      new ErrorHandler(
        "Your image limit exceeds, please purchase more space",
        400
      )
    );
  }

  let files = [];
  if (req.files && req.files.length > 0) {
    files = req.files;
  } else if (req.file) {
    files.push(req.file);
  } else {
    return next(new ErrorHandler("No file uploaded", 400));
  }

  const {
    title,
    description,
    category,
    camera,
    camera_model,
    camera_lens,
    captured_date,
    country = "BD",
  } = req.body;

  // Store all uploaded files in the database
  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const newImage = new Image({
        title: title,
        description: description,
        category: category,
        // Store the file as a Buffer in MongoDB
        image_url: `${BASE_URL}${file.path.replace(/\\/g, "/")}`,
        owner: req.user._id,
        camera,
        camera_model,
        camera_lens,
        captured_date,
        country: req.user.country,
      });

      user.uploaded_images.push(newImage._id);
      return await newImage.save();
    })
  );

  // Updating image limit after upload
  user.image_limit -= files.length;
  await user.save();

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Images uploaded successfully",
    images: uploadedImages,
  });
});

// get all images
exports.getAllImages = catchAsyncErrors(async (req, res, next) => {
  const { query = "", page = 1, limit = 10 } = req.query;

  let searchCriteria = {};
  if (query) {
    // If search query exists, search by username, email, or mobile
    searchCriteria = {
      $or: [
        { userId: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };
  }

  // Get the total count of image matching the search criteria
  const totalImages = await Image.countDocuments(searchCriteria);

  // Use aggregate to fetch images along with owner details
  const images = await Image.aggregate([
    { $match: searchCriteria },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  // If no image found
  if (images.length === 0) {
    return next(new ErrorHandler("No Image found", 404));
  }

  // Send paginated response
  res.status(200).json({
    totalImages,
    currentPage: page,
    totalPages: Math.ceil(totalImages / limit),
    images,
  });
});

//get pending images
exports.getPendingImages = catchAsyncErrors(async (req, res, next) => {
  const { query = "", page = 1, limit = 10 } = req.query;

  let searchCriteria = {};
  if (query) {
    // If search query exists, search by username, email, or mobile
    searchCriteria = {
      $or: [
        { userId: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };
  }

  // Get the total count of image matching the search criteria
  const totalImages = await Image.countDocuments(searchCriteria);

  // Use aggregate to fetch images along with owner details
  const images = await Image.aggregate([
    { $match: searchCriteria },
    { $match: { isLive: false, country: req.user.country } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  // If no image found
  if (images.length === 0) {
    return next(new ErrorHandler("No Image found", 404));
  }

  // Send paginated response
  res.status(200).json({
    totalImages,
    currentPage: page,
    totalPages: Math.ceil(totalImages / limit),
    images,
  });
});

//get live images
exports.getLiveImages = catchAsyncErrors(async (req, res, next) => {
  const { query = "", page = 1, limit = 10 } = req.query;

  let searchCriteria = {};
  if (query) {
    // If search query exists, search by username, email, or mobile
    searchCriteria = {
      $or: [
        { userId: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      $and: [{ country: req.user.country }],
    };
  }

  // Get the total count of image matching the search criteria
  const totalImages = await Image.countDocuments(searchCriteria);

  // Use aggregate to fetch images along with owner details
  const images = await Image.aggregate([
    { $match: searchCriteria },
    { $match: { isLive: true, country: req.user.country } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  // If no image found
  if (images.length === 0) {
    return next(new ErrorHandler("No Image found", 404));
  }

  // Send paginated response
  res.status(200).json({
    totalImages,
    currentPage: page,
    totalPages: Math.ceil(totalImages / limit),
    images,
  });
});

// get an image
exports.getAnImage = catchAsyncErrors(async (req, res, next) => {
  const image = await Image.findById(req.params.id).populate(
    "owner",
    "_id name profile_pic"
  );

  if (!image) {
    return next(new ErrorHandler("Image not found", 404));
  }

  res.status(200).send({
    success: true,
    image,
  });
});

// get most liked images
exports.getMostLikedImages = catchAsyncErrors(async (req, res, next) => {
  const images = await Image.find({ country: req.user.country })

    .sort({ likesCount: -1 })
    .limit(10)
    .populate("owner", "name profile_pic");

  res.status(200).json({
    success: true,
    statusCode: 200,
    messages: "successfully fetched images",
    images,
  });
});

// update image data
exports.updateImage = catchAsyncErrors(async (req, res, next) => {
  let image = await Image.findById(req.params.id);

  if (!image) {
    return next(new ErrorHandler("Image not found!", 404));
  }

  image = await Image.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).send({
    success: true,
    statusCode: 200,
    image,
  });
});

// approve image
exports.approveImage = catchAsyncErrors(async (req, res, next) => {
  const imageId = req.params.id;
  const image = await Image.findById({ _id: imageId });

  if (!image) {
    return next(new ErrorHandler("Image not found!"), 404);
  }

  image.isLive = true;
  await image.save();
  res.status(200).send({
    success: true,
    message: "Now Image is Live",
  });
});

// if need then delete an image
exports.deleteImage = catchAsyncErrors(async (req, res, next) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    return next(new ErrorHandler("Image not found", 404));
  }
  const user = await User.findById(image.owner);
  if (!user) {
    return next(new ErrorHandler("image owner not found", 404));
  }
  user.uploaded_images.pull(image._id);
  user.image_limit += 1;
  await image.deleteOne();

  res.status(200).send({
    success: true,
    statusCode: 200,
    message: "image deleted successfully!",
  });
});

//like image
exports.likeImage = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const image = await Image.findById(req.params.id);
  const user = await User.findById(userId);
  if (!image) {
    return next(new ErrorHandler("image not found", 404));
  }

  const alreadyLiked = image.likes.includes(userId);

  if (alreadyLiked) {
    image.likes.pull(userId);
    image.likesCount = Math.max(0, image.likesCount - 1);
    //updating user's liked_images attribute
    user.liked_images.pull(image._id);
  } else {
    image.likes.push(userId);
    image.likesCount += 1;
    //updating user's liked_images attribute
    user.liked_images.push(image._id);
    //sending notification
    if (req.user._id.toString() != image.owner._id.toString()) {
      const sendNotification = await AppNotification.create({
        user: image.owner,
        title: `${user.name}`,
        message: `liked your image`,
        country: req.user.country,
      });
      await sendNotification.save();
    }
  }

  await user.save();
  await image.save();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: alreadyLiked ? "unlike the image" : "liked the image",
  });
});
//purchase image
exports.purchaseImage = catchAsyncErrors(async (req, res, next) => {
  const { userId, imageId, price } = req.body;
  const user = await User.findById(userId);

  const purchasedImage = user.purchased_images.find(
    (img) => img.image.toString() === imageId
  );

  if (purchasedImage) {
    if (
      purchasedImage.isUsedForGame &&
      new Date() - new Date(purchasedImage.played_at) < 15 * 24 * 60 * 60 * 1000
    ) {
      return next(
        new ErrorHandler(
          "You cannot purchase this image again within 15 days of playing."
        )
      );
    }

    return next(new ErrorHandler("You have already purchased this image."));
  }

  if (user.wallet < price) {
    return next(new ErrorHandler("Insufficient coins please buy coin.", 401));
  }

  const image = await Image.findById(imageId).populate(
    "owner",
    "_id name profile_pic"
  );

  user.wallet -= price;

  // Update image and user data
  image.sold_count += 1;
  image.owner.total_sales += price / 2;

  image.sold_details.push({
    buyer: user._id,
    date: Date.now(),
    price: price / 2,
  });

  //update transaction model
  const transactionInfo = await Transaction.create({
    user: req.user._id,
    type: "purchase",
    item: "image",
    amount: 1,
    price: price / 2,
    country: req.user.country,
  });
  await transactionInfo.save();

  image.bought_by.push(user._id);
  user.purchased_images.push({ image: image._id });

  await image.save();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Successfully purchased the image",
    image,
  });
});

// get the user's gallery
exports.getUserMarketPlaceImages = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const images = await Image.find({ owner: userId }).populate(
    "owner",
    "name profile_pic"
  );

  if (!images) {
    next(new ErrorHandler("Image not found", 404));
  }

  res.status(200).send({
    success: true,
    images,
  });
});
