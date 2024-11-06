const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");

const upload = require("../middlewares/upload");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");
const router = express.Router();

router.post(
  "/category",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isAuthenticated,
  createCategory
);
router.get("/category", isAuthenticated, getCategories);
router.patch(
  "/category/:id",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isAuthenticated,
  updateCategory
);
router.delete("/category/:id", isAuthenticated, deleteCategory);
module.exports = router;
