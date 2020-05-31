const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Player = require('./Player');

const Game = new Schema(
    {
        room: {
            type: String,
            validate: {
                validator: function(v) {
                    return /[a-zA-Z]/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            required: [true, 'Room is required']
        },
        status: {
            type: String,
            enum: ['NOT_STARTED', 'IN_PROGRESS', 'FINISHED']
        },
        players: [
            {
                type: Schema.Types.ObjectId,
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

module.exports = mongoose.model('Game', Game);
