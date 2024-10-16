const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const validator = require('validator')
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const crypto = require('crypto')


const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Please enter your username"],
        trim: true,
        unique:[true, "user name should be unique"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"],
    },
    password:{
        type:String,
        minLenght: [8, "Password should be 8 charechters"],
        required: [true, "Please enter your password"],
        
    },
    mobileNo:{
        type:Number,
        unique:true,
        required:[true, "Please enter your mobile number"]
    },
    referralCode:{type:String,default:''},
    profile_pic: { type: String },
    cover_pic: { type: String },
    image_limit:{type:Number, default:5},
    uploaded_images: { type: Number, default: 0 },
    total_likes: { type: Number, default: 0 },
    total_sales: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    liked_images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    role: { type: String, enum: ['user', 'photographer', 'buyer', 'admin'], default: 'user' },
    followers: { type: Number, default: 0 },
    following:{type:Number, default:0},
    fcmToken: { type: String },
    resetPasswordOtp: { type: String }, 
    resetPasswordOtpExpire: { type: Date },

}, { timestamps: true })

// hash password
userSchema.pre("save", async function (next) {
    // Check if the password field has been modified
    if (!this.isModified("password")) {
      // If the password is not modified, move to the next middleware
      return next();
    }
   // Hash the password if it's new or modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

//get jwt
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.COOKIE_EXPIRE})
}

// compaer password 
userSchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
}

// generating password reset token
userSchema.methods.getForgetPasswordOtp = function(){
    // generate otp
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // hashing and add reset password otp to user schema
    this.resetPasswordOtp = crypto
        .createHash('sha256')
        .update(resetOtp)
        .digest('hex') 
    
    this.resetPasswordOtpExpire = Date.now() + 15 * 60 * 1000;
    return resetOtp;

}


module.exports = mongoose.model("User", userSchema);