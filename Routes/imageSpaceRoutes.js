const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  createImageSpaceInfo,
  getImageSpacesInfo,
  updateImageSpacesInfo,
  deleteImageSpacesInfo,
} = require("../Controllers/ImageSpaceController");

const router = express.Router();

router.post("/imageSpaces", isAuthenticated, createImageSpaceInfo);
router.get("/imageSpaces", isAuthenticated, getImageSpacesInfo);
router.patch("/imageSpaces/:id", isAuthenticated, updateImageSpacesInfo);
router.delete("/imageSpaces/:id", isAuthenticated, deleteImageSpacesInfo);

module.exports = router;
