const express = require('express')
const upload = require('../middlewares/upload');
const { purchaseImage, purchaseSpace, uploadPhoto, getAllImages, updateImage, deleteImage, likeImage, getAnImage, getMostLikedImages, getUserGallery } = require('../Controllers/imageController');
const { isAuthenticated } = require('../middlewares/Auth');


const router = express.Router();



router.get("/getAllImages", isAuthenticated, getAllImages);
//get user's gallery images
router.get("/getUserGallery", isAuthenticated, getUserGallery);
//get mostLiked images
router.get("/getMostLikedImages", isAuthenticated, getMostLikedImages);
router.get("/getAnImage/:id", isAuthenticated, getAnImage);
//puload new image
router.post('/upload-photo', isAuthenticated, upload.any('photos', 5), uploadPhoto);
// upadate image info
router.patch("/image/update/:id", isAuthenticated, updateImage);
//delete image
router.delete('/image/delete/:id', isAuthenticated, deleteImage);

router.post("/like/:imageId", isAuthenticated, likeImage);
//purchaes image
router.post("/purchaseImage", isAuthenticated, purchaseImage);
//purchase space
router.post("/purchaseSpace", isAuthenticated, purchaseSpace);


module.exports = router;
