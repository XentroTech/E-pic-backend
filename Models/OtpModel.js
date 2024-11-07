const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobileNo: { type: String, required: true, unique: true }, 
    otp: { type: String, required: true }, // The OTP code
    createdAt: { type: Date, default: Date.now, expires: '5m' } 
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
