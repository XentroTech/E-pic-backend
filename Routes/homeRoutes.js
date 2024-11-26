const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  getTopSellers,
  getBestSellingImages,
  getWeeklyTopSellingImages,
  getForYouImages,
  getFeaturedImages,
  makeFeaturedAndRemoveFeaturedImage,
  getImagesAsCategory,
  getImagesOfFollowedUser,
  search,
  getChartData,
} = require("../Controllers/homeController");

const router = express.Router();

router.get("/user/topSeller", isAuthenticated, getTopSellers);
router.get("/image/bestSelling", isAuthenticated, getBestSellingImages);
router.get("/image/weeklyTop", isAuthenticated, getWeeklyTopSellingImages);
router.get("/image/forYou", isAuthenticated, getForYouImages);
router.get("/image/new", isAuthenticated, getForYouImages);
router.get("/image/featured", isAuthenticated, getFeaturedImages);
router.get(
  "image/category/:categoryName",
  isAuthenticated,
  getImagesAsCategory
);
router.get("/image/followed", isAuthenticated, getImagesOfFollowedUser);
router.get("/search", isAuthenticated, search);
router.get("/chart/data", isAuthenticated, getChartData);
//admin
router.post(
  "/image/featured/:imageId",
  isAuthenticated,
  makeFeaturedAndRemoveFeaturedImage
);

module.exports = router;
