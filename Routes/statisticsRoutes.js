const express = require("express");
const router = express.Router();

const {
  getChartData,
  getSoldImages,
  getWeeklyTargetGraph,
} = require("../Controllers/statisticsController");
const { isAuthenticated } = require("../middlewares/Auth");

router.get("/statistics/data", isAuthenticated, getChartData);
router.get("/statistics/soldImages", isAuthenticated, getSoldImages);
router.get("/statistics/targetGraph", isAuthenticated, getWeeklyTargetGraph);
module.exports = router;
