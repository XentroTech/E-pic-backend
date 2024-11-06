const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  image_url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
