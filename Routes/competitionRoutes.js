const express = require("express");
const {
  createCompetition,
  getCompetition,
  deleteCompetition,
  updateCompetition,
} = require("../Controllers/competitionController");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/Auth");
const { createEntry } = require("../Controllers/competitionEntryController");
const {
  competitionLeaderBoard,
} = require("../Controllers/competitionLeaderBoard");
const upload = require("../middlewares/upload");

router.post("/competition/create", isAuthenticated, createCompetition);
router.get("/competition/list", isAuthenticated, getCompetition);
router.patch("/competition/update/:id", isAuthenticated, updateCompetition);
router.delete("/competition/delete/:id", isAuthenticated, deleteCompetition);

//competition Entry
router.post(
  "/competition/entry",
  isAuthenticated,
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  createEntry
);
// competition leaderboard
router.get("/competition/leaderboard", isAuthenticated, competitionLeaderBoard);

module.exports = router;
