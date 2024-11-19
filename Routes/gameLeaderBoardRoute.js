const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  getGameLeaderBoard,
} = require("../Controllers/gameLeaderBoardController");
const router = express.Router();

router.post("/game/leaderBoard", isAuthenticated, getGameLeaderBoard);
module.exports = router;
