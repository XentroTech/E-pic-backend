const express = require("express");
const {
  getTransactionHistory,
  AddTransactionToUserWallet,
} = require("../Controllers/walletController");

const router = express.Router();

router.get("/wallet/:userId", getTransactionHistory);

router.post("/wallet/transaction/:userId", AddTransactionToUserWallet);

module.exports = router;
