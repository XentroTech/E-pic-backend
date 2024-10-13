const Image = require('../Models/imageModel')
const User = require('../Models/userModel')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')


exports.uploadPhoto = catchAsyncErrors( async (req, res, next) => {
    const imageCount = req.files.length
    const user = await User.findById("67079a42634a0fd1d3a1b63b")
    
    if (imageCount >= user.image_limit ) {
        return next(new ErrorHandler("Your image limit exceed please puchase space", 400))
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
    user.uploaded_images += req.files.length;
    //updating image limit after upload
    user.image_limit -= req.files.length;
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

    image.owner.uploaded_images -= 1;
    image.owner.image_limit +=1;
    await image.remove();

    res.status(200).send({
        success: true,
        message: "image deleted successfully!"
    })

})

//like image
exports.likeImage = catchAsyncErrors(async(req, res, next)=>{
    const userId = req.user._id;
    const image = await Image.findById(req.params)
    const user = await User.findById(userId)
    if(!image){
        return next(new ErrorHandler("image not found", 404))
    }

    const alreadyLiked = image.likes.includes(userId);

    if(alreadyLiked){
        image.likes.pull(userId);
        image.likesCount -= 1;
        //updating user's liked_images attribute
        user.liked_images.pull(image._id)
    }else{
        image.likes.push(userId);
        image.likesCount += 1;
        //updating user's liked_images attribute
        user.liked_images.push(image._id)
    }

    await image.save();
    res.status(200).json({
        message: alreadyLiked ? "unliked the image" : "liked the image",
        likesCount:image.likes.length
    })

})
//purchase Image
exports.purchaseImage = catchAsyncErrors(async(req, res, next)=>{
    const {userId, imageId, price} = req.body;
    const user = await User.findById(userId);

    if(usr.wallet < price){
        return next(new ErrorHandler("Insufficient Coin Please Purchase Coin", 401))
    }
    const image = await Image.findById(imageId)
    //updating user wallet
    user.wallet -= price;
    // updating sold count of purchased image
    image.sold_count +=1;
    //updating image owner's total_sales
    image.owner.total_salse += price;

    res.status(200).json({
        message:"successfully purchase the image",
        image
    })

})

// purchase spaces 
exports.purchaseSpace = catchAsyncErrors(async(req, res, next)=>{
    const {spaceBundle, paymentDetails} = req.body

    let newSpace = 0;

    if(spaceBundle === "10"){
        newSpace = 10
    }else if(spaceBundle === "50"){
        newSpace = 50
    }else if(spaceBundle === "100"){
        newSpace = 100
    }

    const paymentSuccess = processPayment(paymentDetails);

    if(paymentSuccess){
        const user = await User.findById(req.user._id);
        user.image_limit += newSpace
    }else{
        return next(new ErrorHandler("payment not successfull"))
    }
    res.status(200).json({
        message: `Successfully purchased ${newSpace} coins`
    })
})