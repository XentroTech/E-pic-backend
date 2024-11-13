const express = require("express");
const {
  createSponsorship,
  getActiveSponsorships,
  updateSponsor,
  deleteSponsor,
} = require("../Controllers/sponsorshipController");
const { isAuthenticated } = require("../middlewares/Auth");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post(
  "/sponsor",
  isAuthenticated,
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  createSponsorship
);
router.get("/sponsor", isAuthenticated, getActiveSponsorships);
router.patch(
  "/sponsor",
  isAuthenticated,
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  updateSponsor
);
router.delete("/sponsor", isAuthenticated, deleteSponsor);

module.exports = router;
