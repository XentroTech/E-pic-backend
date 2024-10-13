const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const gameResult = new Schema({
    userId:{},
    gameId:{},
    win_count:{}
});


module.exports = mongoose.Model('GameResult', gameResult);
