const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  createPrizeInfo,
  getPrizeInfo,
  updatePrizeInfo,
  deletePrizeInfo,
  distributePrizes,
  getWinnersInfo,
} = require("../Controllers/prizeController");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post(
  "/prize",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isAuthenticated,
  authorizeRoles("admin, superadmin"),
  createPrizeInfo
);
router.get("/prize", isAuthenticated, getPrizeInfo);
router.patch(
  "/prize/:id",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isAuthenticated,
  authorizeRoles("admin, superadmin"),
  updatePrizeInfo
);
router.delete(
  "/prize/:id",
  isAuthenticated,
  authorizeRoles("admin, superadmin"),
  deletePrizeInfo
);
router.get(
  "/prize/winners",
  isAuthenticated,
  // authorizeRoles("admin, superadmin"),
  getWinnersInfo
);
router.post(
  "/prize/distribute",
  isAuthenticated,
  // authorizeRoles("admin, superadmin"),
  distributePrizes
);

module.exports = router;
