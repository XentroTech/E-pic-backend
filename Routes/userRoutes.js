const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getAUser,
  updateUser,
  deleteUser,
  purchaseCoin,
  getTopSellers,
  updateUserProfile,
  resetPasswordOtpVerify,
  followUser,
  updateUserRole,
  getUsers,
  activeOrDeactivateUser,
  getPurchasedImages,
  get_purchased_images,
  getReferralBonusDetails,
} = require("../Controllers/userController");
const { loginValidator } = require("../middlewares/loginValidator");
const { registerValidator } = require("../middlewares/registerValidator");
const loginRequestLimiter = require("../middlewares/loginRateLimit");
const upload = require("../middlewares/upload");
const {
  resetPasswordValidator,
} = require("../middlewares/resetPasswordValidator");
const { isAuthenticated, authorizeRoles } = require("../middlewares/Auth");

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginRequestLimiter, login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/verify/resetPasswordOtp", resetPasswordOtpVerify);
router.patch("/password/reset/:email", resetPasswordValidator, resetPassword);

//get an user
router.get("/user/:id", isAuthenticated, getAUser);
//update user profile
router.patch(
  "/user",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cover_pic", maxCount: 1 },
  ]),
  isAuthenticated,
  updateUserProfile
);

//follow user
router.post("/follow/:id", isAuthenticated, followUser);

//purchase coin
router.post("/purchaseCoin", isAuthenticated, purchaseCoin);
//referral bonus
router.get("/referralBonus", isAuthenticated, getReferralBonusDetails);

//admin routes

//get all user
router.get(
  "/user",
  isAuthenticated,
  authorizeRoles("admin", "superadmin"),
  getUsers
);
//update user role
router.put(
  "/admin/update/role/:id",
  isAuthenticated,
  authorizeRoles("admin", "superadmin"),
  updateUserRole
);
// delete a user
router.delete(
  "/user/:id",
  isAuthenticated,
  authorizeRoles("admin", "superadmin"),
  deleteUser
);
// user activation
router.post(
  "/user/activation/:id",
  isAuthenticated,
  authorizeRoles("admin", "superadmin"),
  activeOrDeactivateUser
);

//get purchased images
router.get("/user/purchasedImages/:id", isAuthenticated, getPurchasedImages);

module.exports = router;
