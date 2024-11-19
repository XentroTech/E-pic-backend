const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createGameTime,
  getGameTime,
  updateGameTime,
  deleteGameTime,
} = require("../Controllers/gameController");
const router = express.Router();

router.post("/game/createTime", isAuthenticated, createGameTime);
router.get("/game/getTime", isAuthenticated, getGameTime);
router.patch("/game/update/:id", isAuthenticated, updateGameTime);
router.delete("/game/delete/:id", isAuthenticated, deleteGameTime);

module.exports = router;
