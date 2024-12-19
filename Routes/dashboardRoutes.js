const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  getDashboardData,
  getImageRevenue,
  getSpaceRevenue,
  getCoinRevenue,
} = require("../Controllers/dashboardController");

const router = express.Router();

router.get(
  "/dashboard/statistics/image",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  getImageRevenue
);
router.get(
  "/dashboard/statistics/space",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  getSpaceRevenue
);
router.get(
  "/dashboard/statistics/coin",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  getCoinRevenue
);

module.exports = router;
