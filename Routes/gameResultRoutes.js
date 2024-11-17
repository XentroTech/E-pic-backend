const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createGameResult,
  getGameResult,
} = require("../Controllers/gameResultController");
const router = express.Router();

router.post("/game/result/create", isAuthenticated, createGameResult);
router.get("/game/result/list", isAuthenticated, getGameResult);

module.exports = router;
