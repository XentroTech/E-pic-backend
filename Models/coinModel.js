const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoinSchema = new Schema({
  coin: { type: String },
  price: { type: String },
  image_url: { type: String, default: "" },
});

const Coin = mongoose.model("Coin", CoinSchema);
module.exports = Coin;
