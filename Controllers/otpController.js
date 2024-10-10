const Otp = require('../Models/OtpModel.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js')
const ErrorHandler = require('../utils/errorHandler.js')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const twilio = require('twilio');

// generating otp
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).stirng()
};



exports.sendOtp = catchAsyncErrors(async(req, res, next)=>{
    const accountSid = process.env.ACCOUNT_SID
    const authToken = process.env.ACCOUNT_AUTH_TOKEN
    const client = twilio(accountSid, authToken);
    const fromNumber = process.env.TWILIO_NUMBER
    
    const {mobileNo} = req.body;

    // is valid mobile number
    if (!/^\d{10,15}$/.test(mobileNumber)) {
        return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    const ifExist = await User.findOne({mobileNo: req.body.mobileNo})

    if(ifExist){
        return next(new ErrorHandler("This number is already registered", 400))
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
    
    // hashing otp before saving to the database
    const hashedOtp = bcrypt.hash(otp, 10);

    try {
        // Save OTP to the database
        await Otp.create({ mobileNo, hashedOtp, expiresAt });
        // saving mobile no to session for updating register
        req.session.mobileNo = mobileNo
        // Send the OTP using Twilio Messaging API
        const message = await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: fromNumber, 
            to: mobileNo 
        });

        res.status(200).send({ message: `OTP sent to ${mobileNo}`, sid: message.sid });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send({ error: 'Failed to send OTP' });
    }
})

exports.verifyOtp = catchAsyncErrors( async (req, res) => {
   const {otp} = req.body;
   
   //otp sanitization and validation
   if (!otp || !/^\d{6}$/.test(otp)) {
    return next(new ErrorHandler("Invalid OTP", 400))
}
    // last record of otp
    const otpRecord = await Otp.findOne().sort({createdAt: -1})

    // checking is otp expired
    if(Date.now() > otpRecord.expires){
        return next(new ErrorHandler(" OTP Expired", 400))

    }

    // compate otp
    const isMatch = bcrypt.compare(otp, otpRecord.otp)

    if(!isMatch){
        return next(new ErrorHandler(" Invalid OTP", 400))
    }

    res.status(200).json({success: true, message:" Otp varification successful!"})
})


