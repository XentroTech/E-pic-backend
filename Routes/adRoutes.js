const express = require('express');
const { rewardUserForAd } = require('../Controllers/adController');
const { isAuthenticated } = require('../middlewares/Auth');
const router = express.Router();

router.post('/adReward', isAuthenticated, rewardUserForAd);