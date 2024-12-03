const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");

const {
  createCoinInfo,
  getCoinInfo,
  updateCoinInfo,
  deleteCoinInfo,
  purchaseCoin,
} = require("../Controllers/coinController");
const { checkPromoExpiration } = require("../middlewares/checkPromoExpiration");

const router = express.Router();

router.post("/coin", isAuthenticated, createCoinInfo);
router.get("/coin", isAuthenticated, getCoinInfo);
router.patch("/coin/:id", isAuthenticated, updateCoinInfo);
router.delete("/coin/:id", isAuthenticated, deleteCoinInfo);
router.post(
  "/coin/purchase",
  isAuthenticated,
  checkPromoExpiration,
  purchaseCoin
);

module.exports = router;
