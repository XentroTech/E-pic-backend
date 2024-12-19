const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const SearchBarTitle = require("../Models/searchbarTitleModel");
const ErrorHandler = require("../utils/errorHandler");

//create title
exports.createTitle = catchAsyncErrors(async (req, res, next) => {
  const { title } = req.body;
  console.log(title);
  if (!title) {
    return next(new ErrorHandler("please provide title", 400));
  }

  const newTitle = await SearchBarTitle.create({
    title: title,
  });

  res.status(200).json({
    success: true,
    newTitle,
  });
});

//get titles
exports.getTitle = catchAsyncErrors(async (req, res, next) => {
  const titles = await SearchBarTitle.find({});

  if (!titles) {
    return next(new ErrorHandler("Title not found", 404));
  }
  res.status(200).json({
    success: true,
    titles,
  });
});

//update title
exports.updateTitle = catchAsyncErrors(async (req, res, next) => {
  const titleToUpdate = await SearchBarTitle.findOne({ _id: req.params.id });
  if (!titleToUpdate) {
    return next(new ErrorHandler("title not found", 404));
  }
  const { data } = req.body;
  const updatedTitle = await SearchBarTitle.findByIdAndUpdate(
    req.params.id,
    { title: data },
    { new: true, runValidators: true }
  );
  console.log("updated", updatedTitle);

  res.status(200).json({
    success: true,
    message: "Title has been updated",
    updatedTitle,
  });
});

//delete title
exports.deleteTitle = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const title = await SearchBarTitle.findById(id);

  if (!title) {
    return next(new ErrorHandler("Title not found", 404));
  }
  await title.deleteOne();

  res.status(200).json({
    success: true,
    message: "title has been deleted",
  });
});
