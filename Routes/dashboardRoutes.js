const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  getDashboardData,
  getImageRevenue,
  getSpaceRevenue,
  getCoinRevenue,
} = require("../Controllers/dashboardController");

const router = express.Router();

router.get("/dashboard/statistics/image", isAuthenticated, getImageRevenue);
router.get("/dashboard/statistics/space", isAuthenticated, getSpaceRevenue);
router.get("/dashboard/statistics/coin", isAuthenticated, getCoinRevenue);

module.exports = router;
