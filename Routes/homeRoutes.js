const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  getTopSellers,
  getBestSellingImages,
  getWeeklyTopSellingImages,
  getForYouImages,
} = require("../Controllers/homeController");

const router = express.Router();

router.get("/topSeller", isAuthenticated, getTopSellers);
router.get("/bestSellingImages", isAuthenticated, getBestSellingImages);
router.get("/weeklyTopImages", isAuthenticated, getWeeklyTopSellingImages);
router.get("/forYou", isAuthenticated, getForYouImages);

module.exports = router;
