const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["purchase", "withdraw"], required: true },
  item: { type: String, enum: ["coin", "image", "space"], required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
