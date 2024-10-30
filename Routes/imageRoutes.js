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
router.get("/getImages", isAuthenticated, getAllImages);
// get pending images
router.get("/getPendingImages", isAuthenticated, getPendingImages);
// get Live images
router.get("/getLiveImages", isAuthenticated, getLiveImages);
//get user's gallery images
router.get(
  "/getUserMarketPlaceImages",
  isAuthenticated,
  getUserMarketPlaceImages
);
//get mostLiked images
router.get("/getMostLikedImages", isAuthenticated, getMostLikedImages);
router.get("/getAnImage/:id", isAuthenticated, getAnImage);
// approve image
router.patch("/image/approveImage/:id", isAuthenticated, approveImage);
//upload new image
router.post(
  "/upload-photo",
  isAuthenticated,
  upload.any("image", 5),
  uploadPhoto
);
// upadate image info
router.patch("/image/update/:id", isAuthenticated, updateImage);
//delete image
router.delete("/image/delete/:id", isAuthenticated, deleteImage);

router.post("/like/:imageId", isAuthenticated, likeImage);
//purchaes image
router.post("/purchaseImage", isAuthenticated, purchaseImage);
//purchase space
router.post("/purchaseSpace", isAuthenticated, purchaseSpace);

module.exports = router;
