const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prizeSchema = new Schema({
  image_url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Prize", prizeSchema);
