const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  createCoinConversion,
  getCoinConversionInfo,
  deleteCoinConversionInfo,
} = require("../Controllers/coinConversionController");

const router = express.Router();

router.post(
  "/coinConversion",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  createCoinConversion
);
router.get("/coinConversion", isAuthenticated, getCoinConversionInfo);
router.delete(
  "/coinConversion/delete",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  deleteCoinConversionInfo
);

module.exports = router;
