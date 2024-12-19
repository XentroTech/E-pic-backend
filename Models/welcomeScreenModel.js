const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WelcomeScreenModel = new Schema({
  title: { type: String },
  image_url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const WelcomeScreen = mongoose.model("WelcomeScreen", WelcomeScreenModel);

module.exports = WelcomeScreen;
