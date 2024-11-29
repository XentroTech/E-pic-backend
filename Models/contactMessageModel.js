const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const contactMessageSchema = new Schema({
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
  isRead: { type: Boolean, default: false },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
module.exports = ContactMessage;
