const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Player = require('./Player');

const Game = new Schema(
    {
        room: String,
        status: {
            type: String,
            enum: ['NOT_STARTED', 'IN_PROGRESS', 'FINISHED']
        },
        players: [
            {
                type: ObjectId,
                ref: 'Player'
            }
        ],
        letters: new Schema({
            revealed: [String],
            hidden: [String]
        })
    },
    { timestamps: true }
);

Game.methods.addPlayer = async function(player, cb) {
    await this.update({ $push: { players: player } });

    return this.players.populate('Player');
};

Game.statics.findActiveGameByRoom = function(room, cb) {
    return this.findOne({
        room,
        status: { $in: ['NOT_STARTED', 'IN_PROGRESS'] }
    }).exec(cb);
};

module.exports = mongoose.model('Game', Game);
