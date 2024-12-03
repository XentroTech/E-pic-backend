const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const { getTransactions } = require("../Controllers/transactionController");

const router = express.Router();

router.get("/transactions", isAuthenticated, getTransactions);

module.exports = router;
