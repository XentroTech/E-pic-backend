const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const contactSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  message: {
    type: String,
    required: [true, "Please write your message"],
  },
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
