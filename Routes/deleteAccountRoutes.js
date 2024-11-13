const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createDeleteAccountRequest,
  getUserDeleteRequest,
  approveDeleteAccountRequest,
} = require("../Controllers/deleteAccountController");

const router = express.Router();

router.post("/delete/account", isAuthenticated, createDeleteAccountRequest);
router.get("/delete/account", isAuthenticated, getUserDeleteRequest);
router.delete(
  "/delete/account/approve",
  isAuthenticated,
  approveDeleteAccountRequest
);
router.delete("/delete/account/decline", isAuthenticated, declineRequest);

module.exports = router;
