const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");

const {
  createCoinInfo,
  getCoinInfo,
  updateCoinInfo,
  deleteCoinInfo,
  purchaseCoin,
} = require("../Controllers/coinController");
const { checkPromoExpiration } = require("../middlewares/checkPromoExpiration");

const router = express.Router();

router.post(
  "/coin",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  createCoinInfo
);
router.get("/coin", isAuthenticated, getCoinInfo);
router.patch(
  "/coin/:id",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  updateCoinInfo
);
router.delete(
  "/coin/:id",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  deleteCoinInfo
);
router.post(
  "/coin/purchase",
  isAuthenticated,
  checkPromoExpiration,
  purchaseCoin
);

module.exports = router;
