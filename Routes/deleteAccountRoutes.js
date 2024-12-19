const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
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
  // authorizeRoles("admin", "superadmin"),
  getUserDeleteRequest
);
router.delete(
  "/delete/account/approve/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  approveDeleteAccountRequest
);
router.post("/delete/account/decline/:id", isAuthenticated, declineRequest);

module.exports = router;
