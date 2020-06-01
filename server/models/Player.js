const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Player = new Schema(
    {
        name: String,
        game: ObjectId,
        words: [String],
        points: Number,
        token: String,
        isCreator: Boolean
    },
    { timestamps: true }
);

module.exports = mongoose.model('Player', Player);
