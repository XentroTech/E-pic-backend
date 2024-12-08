const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoinSchema = new Schema({
  coin: { type: Number },
  price: { type: Number },
  image_url: { type: String, default: "" },
  extraCoins: { type: Number, default: 0 },
  promoExpiration: { type: Date },
  promoActive: { type: Boolean, default: false },
  country: { type: String, required: true },
});

const Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;
