const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  purchaseAllCartItems,
} = require("../Controllers/cartController");

const router = express.Router();

router.post("/cart/addToCart", isAuthenticated, addToCart);
router.get("/cart/get", isAuthenticated, getCart);
router.delete("/cart/delete/:id", isAuthenticated, removeFromCart);
router.delete("/cart/clear", isAuthenticated, clearCart);
router.post("/cart/cartItems/purchase", isAuthenticated, purchaseAllCartItems);

module.exports = router;
