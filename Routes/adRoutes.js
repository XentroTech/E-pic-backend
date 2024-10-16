const express = require('express');
const { rewardUserForAd } = require('../Controllers/adController');
const router = express.Router();

router.post('/adReward', rewardUserForAd);