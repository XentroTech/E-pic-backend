const express = require('express');
const { register, login, logout, forgotPassword, resetPassword, getAllUsers, getAUser, updateUser, deleteUser, purchaseCoin } = require('../Controllers/userController');


const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotPassword',forgotPassword);
router.post('/resetPassword',resetPassword);

router.get('/getUsers', getAllUsers);
router.get('/getUser/:id', getAUser);
router.patch('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

router.post("/purchaseCoin", purchaseCoin);

module.exports = router;