const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createPrizeInfo,
  getPrizeInfo,
  updatePrizeInfo,
  deletePrizeInfo,
} = require("../Controllers/prizeController");
const router = express.Router();

router.post("/prize", isAuthenticated, createPrizeInfo);
router.get("/prize/:id", isAuthenticated, getPrizeInfo);
router.patch("/prize/:id", isAuthenticated, updatePrizeInfo);
router.delete("/prize/:id", isAuthenticated, deletePrizeInfo);
module.exports = router;
