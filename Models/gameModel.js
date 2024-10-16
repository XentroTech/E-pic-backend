const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    type: { type: String, enum: ['daily', 'weekly'], required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // duration in seconds
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

module.exports = mongoose.model('Game', gameSchema);
