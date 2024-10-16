const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rank: { type: Number, required: true },
    score: { type: Number, required: true }, // time in milliseconds
    photo: { type: String }, // for weekly competitions
    competitionType: { type: String, enum: ['daily', 'weekly'], required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);