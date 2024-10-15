const express = require('express');
const { register, login, logout, forgotPassword, resetPassword, getAllUsers, getAUser, updateUser, deleteUser, purchaseCoin, getTopSellers, updateUserProfile } = require('../Controllers/userController');
const { loginValidator } = require('../middlewares/loginValidator');
const { registerValidator } = require('../middlewares/registerValidator');
const loginRequestLimiter = require('../middlewares/loginRateLimit');
const upload = require('../middlewares/upload')

const router = express.Router();


router.post('/register', registerValidator, register);
router.post('/login', loginRequestLimiter, loginValidator, login);
router.post('/logout', logout);
router.post('/forgotPassword',forgotPassword);
router.put('/password/reset/:otp',resetPassword);

router.get('/getUsers', getAllUsers);
router.get('/getUser/:id', getAUser);
//update user profile
router.patch('/updateProfile',  upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'cover_pic', maxCount: 1 }]), updateUserProfile);
// router.patch('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
//get top seller
router.get('/topSellers', getTopSellers);
//purchase coin
router.post("/purchaseCoin", purchaseCoin);

module.exports = router;