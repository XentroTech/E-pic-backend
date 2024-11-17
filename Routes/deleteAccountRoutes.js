const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createDeleteAccountRequest,
  getUserDeleteRequest,
  approveDeleteAccountRequest,
  declineRequest,
} = require("../Controllers/deleteAccountController");

const router = express.Router();

router.post(
  "/delete/account/request",
  isAuthenticated,
  createDeleteAccountRequest
);
router.get(
  "/delete/account/all-request",
  isAuthenticated,
  getUserDeleteRequest
);
router.delete(
  "/delete/account/approve/:id",
  isAuthenticated,
  approveDeleteAccountRequest
);
router.post("/delete/account/decline/:id", isAuthenticated, declineRequest);

module.exports = router;
