const express = require("express");
const {
  createSponsorship,
  getActiveSponsorships,
  updateSponsor,
  deleteSponsor,
} = require("../Controllers/sponsorshipController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post(
  "/sponsor/create",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  createSponsorship
);
router.get("/sponsor/get", isAuthenticated, getActiveSponsorships);
router.patch(
  "/sponsor/update/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  updateSponsor
);
router.delete(
  "/sponsor/delete/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  deleteSponsor
);

module.exports = router;
