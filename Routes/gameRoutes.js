const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createGameTime,
  getGameTime,
} = require("../Controllers/gameController");
const router = express.Router();

router.post("/game/createTime", isAuthenticated, createGameTime);
router.get("/game/get", isAuthenticated, getGameTime);

module.exports = router;
