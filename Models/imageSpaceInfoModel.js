const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSpaceSchema = new Schema({
  space: { type: Number },
  price: { type: Number },
  date: { type: Date, default: Date.now },
  image_url: { type: String, default: "" },
  country: { type: String, required: true },
});

const ImageSpace = mongoose.model("ImageSpace", ImageSpaceSchema);
module.exports = ImageSpace;
