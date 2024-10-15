const express = require('express')
const upload = require('../middlewares/upload');
const { purchaseImage, purchaseSpace, uploadPhoto, getAllImages, updateImage, deleteImage, likeImage, getAnImage, getMostLikedImages, getUserGallery } = require('../Controllers/imageController');


const router = express.Router();



router.get("/getAllImages", getAllImages);
//get user's gallery images
router.get("/getUserGallery", getUserGallery);
//get mostLiked images
router.get("/getMostLikedImages", getMostLikedImages);
router.get("/getAnImage/:id", getAnImage);
//puload new image
router.post('/upload-photo', upload.any('photos', 5), uploadPhoto);
// upadate image info
router.patch("/image/update/:id", updateImage);
//delete image
router.delete('/image/delete/:id', deleteImage);

router.post("/like/:imageId", likeImage);
//purchaes image
router.post("/purchaseImage", purchaseImage);
//purchase space
router.post("/purchaseSpace", purchaseSpace);


module.exports = router;
