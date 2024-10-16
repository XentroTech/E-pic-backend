const express = require('express');
const { updateLeaderboard } = require('../Controllers/leaderBoardController');
const router = express.Router();

router.get('/leaderBoard', updateLeaderboard);