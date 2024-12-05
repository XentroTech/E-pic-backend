const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createTitle,
  getTitle,
  deleteTitle,
  updateTitle,
} = require("../Controllers/searchbarTitleController");
const router = express.Router();

router.post("/searchbarTitle/create", isAuthenticated, createTitle);
router.get("/searchbarTitle/list", isAuthenticated, getTitle);
router.patch("/searchbarTitle/update/:id", isAuthenticated, updateTitle);
router.delete("/searchbarTitle/delete/:id", isAuthenticated, deleteTitle);

module.exports = router;
