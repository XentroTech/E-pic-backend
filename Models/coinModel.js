const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoinSchema = new Schema({
  coin: { type: String },
  price: { type: String },
  image_url: { type: String, default: "" },
  extraCoins: { type: Number, default: 0 },
  promoExpiration: { type: Date },
  promoActive: { type: Boolean, default: false },
});

const Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;
