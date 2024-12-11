const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  getGameLeaderBoard,
} = require("../Controllers/gameLeaderBoardController");
const router = express.Router();

router.get("/game/leaderBoard", isAuthenticated, getGameLeaderBoard);
module.exports = router;
