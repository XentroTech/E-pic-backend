const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const { getDashboardData } = require("../Controllers/dashboardController");

const router = express.Router();

router.get("/dashboard/statistics/get", isAuthenticated, getDashboardData);

module.exports = router;
