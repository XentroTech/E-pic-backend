const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");
const {
  createImageSpaceInfo,
  getImageSpacesInfo,
  updateImageSpacesInfo,
  deleteImageSpacesInfo,
  purchaseSpace,
} = require("../Controllers/ImageSpaceController");

const router = express.Router();

router.post(
  "/imageSpaces",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  createImageSpaceInfo
);
router.get("/imageSpaces", isAuthenticated, getImageSpacesInfo);
router.patch(
  "/imageSpaces/:id",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  updateImageSpacesInfo
);
router.delete(
  "/imageSpaces/:id",
  // authorizeRoles("admin", "superadmin"),
  isAuthenticated,
  deleteImageSpacesInfo
);
router.post("/imageSpaces/purchase", isAuthenticated, purchaseSpace);

module.exports = router;
