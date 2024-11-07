const express = require("express");
const router = express.Router();
const Warning = require("../models/Warning");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Issue a new warning
exports.issueWarning = catchAsyncErrors(async (req, res) => {
  const { message } = req.body;
  try {
    let warning = await Warning.findOne({ userId: req.params.userId });

    if (!warning) {
      warning = new Warning({ userId: req.params.userId });
    }

    warning.warnings.push({ message });
    warning.warningCount += 1;

    if (warning.warningCount >= 3) {
      warning.suspended = true;
      // Add additional logic for suspension (e.g., notify the user)
    }

    await warning.save();
    res.status(200).json({ message: "Warning issued successfully", warning });
  } catch (error) {
    res.status(500).json({ message: "Error issuing warning", error });
  }
});

// View warnings for a user
exports.getWarnings = catchAsyncErrors(async (req, res) => {
  try {
    const warning = await Warning.findOne({ userId: req.params.userId });
    if (!warning) return res.status(404).json({ message: "No warnings found" });

    res.status(200).json(warning);
  } catch (error) {
    res.status(500).json({ message: "Error fetching warnings", error });
  }
});

module.exports = router;
