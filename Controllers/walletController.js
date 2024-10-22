const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");

// View user wallet balance and transaction history
exports.getTransactionHistory = catchAsyncErrors(async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) return res.status(404).json({ message: "No wallet found" });

    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet", error });
  }
});

// Add transaction to user wallet (credit or debit)
exports.AddTransactionToUserWallet = catchAsyncErrors(async (req, res) => {
  const { type, amount, description } = req.body;
  try {
    let wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) {
      wallet = new Wallet({ userId: req.params.userId });
    }

    wallet.transactions.push({ type, amount, description });
    wallet.balance += type === "credit" ? amount : -amount;

    await wallet.save();
    res.status(200).json({ message: "Transaction added successfully", wallet });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error });
  }
});

module.exports = router;
