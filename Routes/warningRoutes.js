const express = require("express");
const {
  issueWarning,
  getWarnings,
} = require("../Controllers/warningController");

const router = express.Router();

router.post("/issue-warning/:userId", issueWarning);

router.get("/warnings/:userId", getWarnings);

module.exports = router;
