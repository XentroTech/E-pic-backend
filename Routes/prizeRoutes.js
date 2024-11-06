const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createPrizeInfo,
  getPrizeInfo,
  updatePrizeInfo,
  deletePrizeInfo,
} = require("../Controllers/prizeController");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post(
  "/prize",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isAuthenticated,
  createPrizeInfo
);
router.get("/prize", isAuthenticated, getPrizeInfo);
router.patch(
  "/prize/:id",
  upload.fields([{ name: "image_url", maxCount: 1 }]),
  isAuthenticated,
  updatePrizeInfo
);
router.delete("/prize/:id", isAuthenticated, deletePrizeInfo);
module.exports = router;
