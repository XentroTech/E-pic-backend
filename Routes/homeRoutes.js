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
  getNewlyAddedImages,
} = require("../Controllers/homeController");

const router = express.Router();

router.get("/topSeller", isAuthenticated, getTopSellers);
router.get("/bestSelling", isAuthenticated, getBestSellingImages);
router.get("/weeklyTop", isAuthenticated, getWeeklyTopSellingImages);
router.get("/forYou", isAuthenticated, getForYouImages);
router.get("/newlyAdded", isAuthenticated, getNewlyAddedImages);
router.get("/featured", isAuthenticated, getFeaturedImages);
router.get(
  "image/category/:categoryName",
  isAuthenticated,
  getImagesAsCategory
);
router.get("/followed", isAuthenticated, getImagesOfFollowedUser);
router.get("/search", isAuthenticated, search);
router.get("/chart/data", isAuthenticated, getChartData);
//admin
router.post(
  "/image/featured/:imageId",
  isAuthenticated,
  makeFeaturedAndRemoveFeaturedImage
);

module.exports = router;
