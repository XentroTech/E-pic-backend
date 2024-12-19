const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/Auth");
const upload = require("../middlewares/upload");
const {
  uploadWelcomeScreenImages,
  getWelcomeScreenInfo,
  deleteWelcomeScreenInfo,
} = require("../Controllers/welcomeScreenController");

// upload info route
router.post(
  "/welcomeScreenInfo",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isAuthenticated,
  uploadWelcomeScreenImages
);
// get info
router.get("/welcomeScreenInfo", isAuthenticated, getWelcomeScreenInfo);
// delete info
router.delete(
  "/welcomeScreenInfo/delete/:id",
  isAuthenticated,
  deleteWelcomeScreenInfo
);

module.exports = router;
