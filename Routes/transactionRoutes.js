const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const { getTransactions } = require("../Controllers/transactionController");

const router = express.Router();

router.get(
  "/transactions",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  getTransactions
);

module.exports = router;
