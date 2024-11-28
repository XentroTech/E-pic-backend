const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prizeSchema = new Schema({
  image_url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["coin", "physical"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rank: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Prize = mongoose.model("Prize", prizeSchema);
module.exports = Prize;
