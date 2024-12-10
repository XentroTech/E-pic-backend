const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createImageSpaceInfo,
  getImageSpacesInfo,
  updateImageSpacesInfo,
  deleteImageSpacesInfo,
  purchaseSpace,
} = require("../Controllers/ImageSpaceController");

const router = express.Router();

router.post("/imageSpaces", isAuthenticated, createImageSpaceInfo);
router.get("/imageSpaces", isAuthenticated, getImageSpacesInfo);
router.patch("/imageSpaces/:id", isAuthenticated, updateImageSpacesInfo);
router.delete("/imageSpaces/:id", isAuthenticated, deleteImageSpacesInfo);
router.post("/imageSpaces/purchase", isAuthenticated, purchaseSpace);

module.exports = router;
