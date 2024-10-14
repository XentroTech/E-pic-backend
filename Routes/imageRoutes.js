const express = require('express')
const upload = require('../middlewares/upload');
const { purchaseImage, purchaseSpace, uploadPhoto, getAllImages, updateImage, deleteImage, likeImage, getAnImage, getMostLikedImages } = require('../Controllers/imageController');


const router = express.Router();


router.post('/upload-photo', upload.any('photos', 10), uploadPhoto);

router.get("/getAllImages", getAllImages);
router.get("/getMostLikedImages", getMostLikedImages);
router.get("/getAnImage/:id", getAnImage);
router.patch("/image/update/:id", updateImage);
router.delete('/image/delete/:id', deleteImage);

router.post("/like/:imageId", likeImage);

router.post("/purchaseImage", purchaseImage);
router.post("/purchaseSpace", purchaseSpace);


module.exports = router;
