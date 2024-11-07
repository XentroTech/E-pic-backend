
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Game = require('../models/Game');

exports.startGame = catchAsyncErrors(async (req, res) => {
    const { type, startTime, endTime, duration } = req.body;

    const game = new Game({
        type,
        startTime,
        endTime,
        duration,
        status: 'active'
    });

    await game.save();
    res.status(201).json({ message: `${type} game started`, game });
});

