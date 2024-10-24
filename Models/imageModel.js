const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: {
      data: Buffer,
      contentType: String,
    },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    sold_count: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploaded_at: { type: Date, default: Date.now },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
