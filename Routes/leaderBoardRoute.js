const express = require('express');
const { updateLeaderboard } = require('../Controllers/leaderBoardController');
const { isAuthenticated } = require('../middlewares/Auth');
const router = express.Router();

router.get('/leaderBoard', isAuthenticated, updateLeaderboard);