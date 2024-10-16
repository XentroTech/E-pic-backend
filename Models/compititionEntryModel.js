const mongoose = require('mongoose');

const competitionEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photo: { type: String, required: true }, // path to uploaded photo
    competitionType: { type: String, enum: ['daily', 'weekly'], required: true },
    completionTime: { type: Number, required: true }, // in milliseconds
    entryTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompetitionEntry', competitionEntrySchema);