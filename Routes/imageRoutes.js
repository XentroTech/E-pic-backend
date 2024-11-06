const express = require("express");
const upload = require("../middlewares/upload");
const {
  purchaseImage,
  purchaseSpace,
  uploadPhoto,
  getAllImages,
  updateImage,
  deleteImage,
  likeImage,
  getAnImage,
  getMostLikedImages,
  getUserMarketPlaceImages,
  approveImage,
  getPendingImages,
  getLiveImages,
} = require("../Controllers/imageController");
const { isAuthenticated } = require("../middlewares/Auth");

const router = express.Router();

//get all images
router.get("/image/all", isAuthenticated, getAllImages);
// get pending images
router.get("/image/pending", isAuthenticated, getPendingImages);
// get Live images
router.get("/image/live", isAuthenticated, getLiveImages);
//get user's gallery images
router.get("/image/marketPlace", isAuthenticated, getUserMarketPlaceImages);
//get mostLiked images
router.get("/image/mostLiked", getMostLikedImages);
router.get("/image/:id", isAuthenticated, getAnImage);
// approve image
router.patch("/image/approveImage/:id", isAuthenticated, approveImage);
//upload new image
router.post(
  "/image/upload",
  isAuthenticated,
  upload.any("image", 5),
  uploadPhoto
);
// update image info
router.patch("/image/update/:id", isAuthenticated, updateImage);
//delete image
router.delete("/image/delete/:id", isAuthenticated, deleteImage);

router.post("/image/like/:id", isAuthenticated, likeImage);
//purchase image
router.post("/image/purchase", isAuthenticated, purchaseImage);
//purchase space
// router.post("/purchaseSpace", isAuthenticated, purchaseSpace);

module.exports = router;
