const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image_url: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    sold_count: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploaded_at: { type: Date, default: Date.now },
    is_featured: { type: Boolean, default: false },
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
