const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Player = new Schema(
    {
        name: String,
        game: {
            type: Schema.Types.ObjectId
        },
        words: [String],
        points: Number,
        token: String,
        isCreator: Boolean,
        socketId: String
    },
    { timestamps: true }
);

module.exports = mongoose.model('Player', Player);
