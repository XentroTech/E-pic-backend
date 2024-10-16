
const Leaderboard = require('../models/Leaderboard');
const CompetitionEntry = require('../models/CompetitionEntry');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.updateLeaderboard = catchAsyncErrors(async (competitionType) => {
    // Fetch top 10 or top 50 based on competition type
    const entries = await CompetitionEntry.find({ competitionType })
        .sort({ completionTime: 1 }) 
        .limit(10); 

    await Leaderboard.deleteMany({ competitionType });

    let rank = 1;
    for (const entry of entries) {
        const leaderboardEntry = new Leaderboard({
            user: entry.user,
            rank,
            score: entry.completionTime,
            photo: entry.photo,
            competitionType
        });

        await leaderboardEntry.save();
        rank++;
    }
});

