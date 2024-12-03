const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createCoinConversion,
  getCoinConversionInfo,
  deleteCoinConversionInfo,
} = require("../Controllers/coinConversionController");

const router = express.Router();

router.post("/coinConversion", isAuthenticated, createCoinConversion);
router.get("/coinConversion", isAuthenticated, getCoinConversionInfo);
router.delete(
  "/coinConversion/delete",
  isAuthenticated,
  deleteCoinConversionInfo
);

module.exports = router;
