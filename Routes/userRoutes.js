const express = require('express');
const { register, login, logout, forgotPassword, resetPassword, getAllUsers, getAUser, updateUser, deleteUser, purchaseCoin, getTopSellers, updateUserProfile, resetPasswordOtpVerify, followUser } = require('../Controllers/userController');
const { loginValidator } = require('../middlewares/loginValidator');
const { registerValidator} = require('../middlewares/registerValidator');
const loginRequestLimiter = require('../middlewares/loginRateLimit');
const upload = require('../middlewares/upload');
const { resetPasswordValidator } = require('../middlewares/resetPasswordValidator');
const { isAuthenticated } = require('../middlewares/Auth');

const router = express.Router();


router.post('/register', registerValidator, register);
router.post('/login', loginRequestLimiter,  login);
router.post('/logout', logout);
router.post('/forgotPassword',forgotPassword);
router.post('/verify/resetPasswordOtp', resetPasswordOtpVerify);
router.patch('/password/reset/:email', resetPasswordValidator, resetPassword);

router.get('/getUsers', isAuthenticated, getAllUsers);
router.get('/getUser/:id', isAuthenticated, getAUser);
//update user profile
router.patch('/updateProfile',  upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'cover_pic', maxCount: 1 }]), isAuthenticated, updateUserProfile);
// router.patch('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', isAuthenticated, deleteUser);
//follow user
router.post('/followUser/:id', isAuthenticated, followUser);
//get top seller
router.get('/topSellers', isAuthenticated, getTopSellers);
//purchase coin
router.post("/purchaseCoin", isAuthenticated, purchaseCoin);

module.exports = router;