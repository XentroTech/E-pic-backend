const Image = require('../Models/imageModel')
const User = require('../Models/userModel')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')


exports.uploadPhoto = catchAsyncErrors( async (req, res) => {
    
    if (req.files.length > 5) {
        return next(new ErrorHandler("Limit is 5 photos", 400))
    }

   let files = [];
    if (req.files && req.files.length > 0) {
        files = req.files;
    } else if (req.file) {
        files.push(req.file);
    } else {
        return next(new ErrorHandler("No file uploaded", 400))
    }

    const { title, description, category, price,} = req.body;

    // Store all uploaded files in the database
    const uploadedImages = await Promise.all(files.map(async (file) => {
        const newImage = new Image({
            title: title,
            description: description,
            // Storing the file URL/path
            image_url: `/uploads/${file.filename}`,  
            category: category,
            price: price,
            
        });

        return await newImage.save();
    }));

    //updating totalupload of user
    const user = await User.findOne({_id: req.user._id});
    const totalUpload = user.uploaded_images;
    user.uploaded_images = totalUpload += req.files.length;
    await user.save();

    res.status(201).json({
        message: 'Images uploaded successfully',
        images: uploadedImages
    });
     
});

// get all images
exports.getAllImages = catchAsyncErrors(async(req, res, next)=>{
    const images = await Image.find({});

    res.status(200).send({success: true, images})
})

// get an image
exports.getAnImage = catchAsyncErrors(async(req, res, next) =>{
   
    const image = await Image.findById(req.params.id)

    if(!image){
        return next(new ErrorHandler("Image not found", 404))
    }

    res.status(200).send({
        success:true,
        image
    })

})

// update image data
exports.updateImage = catchAsyncErrors(async(req, res, next)=>{
    let image = await Image.findById(req.params.id);

    if(!image){
        return next(new ErrorHandler("Image not found!", 404))
    }

    image = await Image.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModifie: false
    })
    
    res.status(200).send({
        success: true,
        image
    })
})

// if need then delete an image
exports.deleteImage = catchAsyncErrors(async(req, res, next)=>{
    const image = await Image.findById(req.params.id)

    if(!image){
        return next(new ErrorHandler("Image not found", 404))
    }

    await image.remove();

    res.status(200).send({
        success: true,
        message: "image deleted successfully!"
    })

})
