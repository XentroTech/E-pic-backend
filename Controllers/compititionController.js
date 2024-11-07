
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const CompetitionEntry = require('../models/CompetitionEntry');
const Game = require('../models/Game');
const User = require('../models/User');

exports.enterCompetition = catchAsyncErrors(async (req, res) => {
    const { userId, photo, competitionType, completionTime } = req.body;

    const activeGame = await Game.findOne({ type: competitionType, status: 'active' });

    if (!activeGame) {
        return res.status(400).json({ message: 'No active game found.' });
    }

    const entry = new CompetitionEntry({
        user: userId,
        photo,
        competitionType,
        completionTime
    });

    await entry.save();
    
    return res.status(200).json({ message: `Successfully entered the ${competitionType} competition!` });
});

