const { v4: uuidv4 } = require('uuid');

const Player = require('../../models/Player');

const createNewPlayer = ({ name, game, isCreator = false }) => {
    return Player.create({
        name,
        game,
        token: uuidv4(),
        words: [],
        points: 0,
        isCreator
    });
};

module.exports = {
    createNewPlayer
};
