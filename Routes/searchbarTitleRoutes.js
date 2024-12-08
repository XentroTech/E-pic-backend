const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createTitle,
  getTitle,
  deleteTitle,
  updateTitle,
} = require("../Controllers/searchbarTitleController");
const router = express.Router();

router.post("/searchBarTitle/create", isAuthenticated, createTitle);
router.get("/searchBarTitle/list", isAuthenticated, getTitle);
router.patch("/searchBarTitle/update/:id", isAuthenticated, updateTitle);
router.delete("/searchBarTitle/delete/:id", isAuthenticated, deleteTitle);

module.exports = router;
