const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  createGameTime,
  getGameTime,
  updateGameTime,
  deleteGameTime,
} = require("../Controllers/gameController");
const {
  getGameLeaderBoard,
} = require("../Controllers/gameLeaderBoardController");
const router = express.Router();

router.post(
  "/game/createTime",
  // authorizeRoles("admin", "superadmin", "moderator"),
  isAuthenticated,
  createGameTime
);
router.get(
  "/game/getTime",
  // authorizeRoles("admin", "superadmin", "moderator"),
  isAuthenticated,
  getGameTime
);
router.patch(
  "/game/update/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin", "moderator"),
  updateGameTime
);
router.delete(
  "/game/delete/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin", "moderator"),
  deleteGameTime
);
// router.get("/game/leaderBoard", isAuthenticated, getGameLeaderBoard);

module.exports = router;
