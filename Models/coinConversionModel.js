const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coinConversionSchema = new Schema({
  currency: { type: Number, required: true },
  coin: { type: Number, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CoinConversion = mongoose.model("CoinConversion", coinConversionSchema);

module.exports = CoinConversion;
