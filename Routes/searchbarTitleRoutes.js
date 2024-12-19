const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  createTitle,
  getTitle,
  deleteTitle,
  updateTitle,
} = require("../Controllers/searchbarTitleController");
const router = express.Router();

router.post(
  "/searchBarTitle/create",

  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  createTitle
);
router.get("/searchBarTitle/list", isAuthenticated, getTitle);
router.patch(
  "/searchBarTitle/update/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  updateTitle
);
router.delete(
  "/searchBarTitle/delete/:id",
  isAuthenticated,
  // authorizeRoles("admin", "superadmin"),
  deleteTitle
);

module.exports = router;
