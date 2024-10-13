const express = require('express')
const upload = require('../middlewares/upload');
const { purchaseImage, purchaseSpace, uploadPhoto, getAllImages, updateImage, deleteImage, likeImage } = require('../Controllers/imageController');


const router = express.Router();


router.post('/upload-photo', upload.any('photos', 10), uploadPhoto);

router.get("/allImages", getAllImages);
router.patch("/update/:id", updateImage);
router.delete('/delete/:id', deleteImage);

router.post("/like/:imageId", likeImage);

router.post("/purchaseImage", purchaseImage);
router.post("/purchaseSpace", purchaseSpace);


module.exports = router;