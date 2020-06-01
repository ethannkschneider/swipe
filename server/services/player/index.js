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

const updateSocketId = async (id, socketId) => {
    const player = await Player.findById(id);
    player.socketId = socketId;
    return player.save();
};

const findBySocketId = socketId => {
    return Player.findOne({ socketId }).populate({
        path: 'game',
        populate: 'players'
    });
};

module.exports = {
    createNewPlayer,
    updateSocketId,
    findBySocketId
};
