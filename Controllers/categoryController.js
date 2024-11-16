const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Prize = require("../Models/prizeModel");
const ErrorHandler = require("../utils/errorHandler");
const Category = require("../Models/categoryModel");

//create Category
const BASE_URL = "https://e-pic.co/";

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  let { name, image_url } = req.body;

  // Process image if included
  if (req.files && req.files.image_url) {
    image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
  }

  // Ensure required fields are not empty
  if (!name || !image_url) {
    return res.status(400).json({
      success: false,
      message: "Category name and image are required.",
    });
  }

  // Create new Category
  const category = new Category({
    name,
    image_url,
  });

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category created successfully!",
    category,
  });
});

// get Categories
exports.getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    success: true,
    categories,
  });
});

//update Category
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    return next(new ErrorHandler("Category not found!", 404));
  }
  let image_url = category.image_url;
  if (req.files && req.files.image_url) {
    image_url = BASE_URL + req.files.image_url[0].path.replace(/\\/g, "/");
  }
  const updatedCategory = await Prize.findByIdAndUpdate(
    id,
    { ...req.body, image_url },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCategory) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  res.status(200).json({
    success: true,
    updatedCategory,
  });
});

// delete category
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  await category.deleteOne();
  res.status(200).json({
    success: true,
    message: "successfully deleted",
  });
});
