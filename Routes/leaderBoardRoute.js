const express = require("express");
const { updateLeaderBoard } = require("../Controllers/leaderBoardController");
const { isAuthenticated } = require("../middlewares/Auth");
const router = express.Router();

router.get("/leaderBoard", isAuthenticated, updateLeaderBoard);
