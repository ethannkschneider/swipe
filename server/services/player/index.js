const { v4: uuidv4 } = require('uuid');

const Player = require('../../models/Player');

const createNewPlayer = ({ name, game }) => {
    return Player.create({
        name,
        game,
        token: uuidv4(),
        words: [],
        points: 0
    });
};

module.exports = {
    createNewPlayer
};
