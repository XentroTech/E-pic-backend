const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  getTopSellers,
  getBestSellingImages,
  getWeeklyTopSellingImages,
  getForYouImages,
} = require("../Controllers/homeController");

const router = express.Router();

router.get("/user/topSeller", isAuthenticated, getTopSellers);
router.get("/image/bestSelling", isAuthenticated, getBestSellingImages);
router.get("/image/weeklyTop", isAuthenticated, getWeeklyTopSellingImages);
router.get("/image/forYou", isAuthenticated, getForYouImages);
router.get("/image/new", isAuthenticated, getForYouImages);

module.exports = router;
