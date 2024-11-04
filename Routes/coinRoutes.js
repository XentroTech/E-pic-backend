const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");

const {
  createCoinInfo,
  getCoinInfo,
  updateCoinInfo,
  deleteCoinInfo,
} = require("../Controllers/coinController");

const router = express.Router();

router.post("/coin", isAuthenticated, createCoinInfo);
router.get("/coin", isAuthenticated, getCoinInfo);
router.patch("/coin/:id", isAuthenticated, updateCoinInfo);
router.delete("/coin/:id", isAuthenticated, deleteCoinInfo);

module.exports = router;
