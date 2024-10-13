const express = require('express');
const { register, login, logout, forgotPassword, resetPassword, getAllUsers, getAUser, updateUser, deleteUser, purchaseCoin, getTopSellers } = require('../Controllers/userController');


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotPassword',forgotPassword);
router.put('/password/reset/:token',resetPassword);

router.get('/getUsers', getAllUsers);
router.get('/getUser/:id', getAUser);
router.patch('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);
//get top seller
router.get('/topSellers', getTopSellers);
//purchase coin
router.post("/purchaseCoin", purchaseCoin);

module.exports = router;