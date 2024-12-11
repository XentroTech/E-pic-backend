const express = require("express");
const { rewardUserForAd } = require("../Controllers/adRewardController");
const { isAuthenticated } = require("../middlewares/Auth");
const router = express.Router();

router.post("/adReward", isAuthenticated, rewardUserForAd);

module.exports = router;
