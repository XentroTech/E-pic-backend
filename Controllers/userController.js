const User = require('../Models/userModel')
const ErrorHandler = require('../utils/errorHandler.js')
const sendToken = require('../utils/jwtToken.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js')
const twilio = require('twilio');
const sendEmail = require('../utils/sendEmail.js')


//register
exports.register = catchAsyncErrors(async(req, res) =>{
    const {username, email, password, mobileNo} = req.body;
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

    if(!email || !password){
        return next(new ErrorHandler("Plsease enter email & password", 401));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = user.comparePassword(password);

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
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired"),400);
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Dosen't match"), 400);
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

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

  user = await User.findByIdAndUpdate(rq.params.id, req.body, {
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

  if(!user){
    return next(new ErrorHandler("user not found", 404))
  }
})


