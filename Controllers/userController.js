const User = require('../Models/userModel')
const ErrorHandler = require('../utils/errorHandler.js')
const sendToken = require('../utils/jwtToken.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js')
const twilio = require('twilio');
const sendEmail = require('../utils/sendEmail.js')
const processPayment = require('../utils/processPayment.js');
const crypto = require('crypto')
const {  validationResult } = require('express-validator');

//register
exports.register = catchAsyncErrors(async(req, res) =>{
    const {username, email, password, mobileNo} = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorHandler(errors.array()[0].msg, 400)); 
    }

    if(!email || !password || !username || !mobileNo){
      return next(new ErrorHandler("Plsease provide all informations", 401));
    }

    const newUser = await User.create({
     username: username, 
     email:email,
     password:password,
     mobileNo: mobileNo
     
    });
    
    sendToken(newUser, 201, res);
 
    
 })

//login
 exports.login = catchAsyncErrors(async(req, res, next)=>{
    const {email, password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorHandler(errors.array()[0].msg, 400)); 
    }

    if(!email || !password){
        return next(new ErrorHandler("Plsease enter email & password", 401));
    }

    const user = await User.findOne({email}).select("+password")
   
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password", 401));
    }

    sendToken(user, 200, res);

 })

//logout
 exports.logout = catchAsyncErrors(async(req, res, next)=>{
    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).send({
        success: true,
        message: "Logout Successufll"
    })

 })

//forget passwrod 
 exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next( new ErrorHandler("User not found"), 403)
    }

    //get reset password token
    const resetToken = user.getForgetPasswordToken()

    await user.save({validateBeforeSave: false});
    //create reset password url
    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you are not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Epic Password Recovery`,
      message,
    });
    res.status(200).send({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }

 })

 //Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
    
  });
  console.log(user, resetPasswordToken, Date.now())

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired"),400);
  }

  
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get all user
exports.getAllUsers = catchAsyncErrors(async(req, res, next)=>{
  const users = await User.find({});
  res.status(200).send({
    success: true,
    users
  })
})

//get a user
exports.getAUser = catchAsyncErrors(async(req, res, next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler("User not found", 404))
  }

  res.status(200).send({
    success: true,
    user
  })
})

//update a user
exports.updateUser = catchAsyncErrors(async(req, res, next)=>{
  let user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler("User not found", 404))
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).send({
    success: true,
    user
  })
})

// delete a user
exports.deleteUser = catchAsyncErrors(async(req, res, next) =>{
  const user = await User.findById(req.params.id)
  console.log(user)
  if(!user){
    return next(new ErrorHandler("user not found", 404))
  }

  // deleting all images associated with user
  const images = await Image.find({ owner: user._id });

    if (images.length > 0) {
        await Image.deleteMany({ owner: user._id });
    }

  await user.deleteOne();

  return res.status(203).json({
    success:true,
    message:"User Deleted Successfully!",
    user
  })
})

//get Top sellers
exports.getTopSellers = catchAsyncErrors(async(req, res, next)=>{
  const topSellers = await User.find({}).sort({total_sales: -1}).limit(5).select("name profile_pic")
  if(!topSellers){
    return next(new ErrorHandler("Top sellers not found", 404))
  }

  res.status(200).json({success: true, topSellers})
})

// purchase coin
exports.purchaseCoin = catchAsyncErrors(async(req, res, next)=>{
  const {coinBundle} = req.body;
  const user = await User.findById(req.user._id)

  let newCoin = 0;

  if(coinBundle === "50"){
    newCoin = 50;
  }else if(coinBundle === "100"){
    newCoin = 100;
  }else if(coinBundle === "500"){
    newCoin = 500;
  }

  const paymentSuccess = await processPayment(paymentDetails)

  if(paymentSuccess){
    user.wallet += newCoin;
    await user.save();
    res.status(200).json({success:true, message:`Successfully purchased ${newCoin} coin`})
  }else{
    return next(new ErrorHandler("payment not successfull"))
  }

})


