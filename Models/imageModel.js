const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image_url: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 10 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    sold_count: { type: Number, default: 0 },
    sold_details: [
      {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
        price: { type: Number, required: true },
      },
    ],
    country: { type: String, required: true },
    camera: { type: String },
    camera_model: { type: String },
    camera_lens: { type: String, default: "" },
    captured_date: { type: String },
    focal_length: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploaded_at: { type: Date, default: Date.now },
    bought_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    competition: [{ type: mongoose.Schema.Types.ObjectId, ref: "Competition" }],
    isLive: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
