const mongoose = require("mongoose");

const deleteAccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  image_url: { type: String },
  requested_at: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("DeleteAccount", deleteAccountSchema);
