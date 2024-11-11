const express = require("express");
const { isAuthenticated } = require("../middlewares/Auth");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../Controllers/cartController");

const router = express.Router();

router.post("/cart/addToCart", isAuthenticated, addToCart);
router.get("/cart", isAuthenticated, getCart);
router.delete("/cart/:id", isAuthenticated, removeFromCart);
router.delete("/cart/", isAuthenticated, clearCart);

module.exports = router;
