const express = require('express')
const upload = require('../middlewares/upload');
const { uploadPhoto, getAllImages, updateImage, deleteImage } = require('../Controllers/imageController');

const router = express.Router();


router.post("/upload", (req, res, next)=>{
    if(req.body.multiple === 'true'){
        //if multiple images
        upload.array('image', 5)(req, res, next)
    }else{
        // if single image
        upload.single('image')(req,res,next)
    }
}, uploadPhoto)

router.get("/allImages", getAllImages);
router.patch("/update/:id", updateImage);
router.delete('/delete/:id', deleteImage);