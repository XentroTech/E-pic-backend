const express = require("express");
const {
  createCompetition,
  getCompetition,
  deleteCompetition,
  updateCompetition,
} = require("../Controllers/competitionController");
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const { createEntry } = require("../Controllers/competitionEntryController");
const {
  competitionLeaderBoard,
} = require("../Controllers/competitionLeaderBoardController");
const upload = require("../middlewares/upload");

router.post(
  "/competition/create",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  createCompetition
);
router.get("/competition/list", isAuthenticated, getCompetition);
router.patch(
  "/competition/update/:id",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  updateCompetition
);
router.delete(
  "/competition/delete/:id",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  deleteCompetition
);

//competition Entry
router.post(
  "/competition/entry",
  isAuthenticated,
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  createEntry
);
// competition leaderboard
router.post(
  "/competition/leaderboard",
  isAuthenticated,
  competitionLeaderBoard
);

module.exports = router;
