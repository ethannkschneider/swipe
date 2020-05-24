const Game = require('../../models/Game');
const { LETTER_FREQUENCIES } = require('../../constants');
const { shuffle } = require('../../utils');

const _generateInitialLetterPool = () =>
    shuffle(
        [...LETTER_FREQUENCIES].reduce(
            (acc, [ltr, freq]) => [...acc, ...new Array(freq).fill(ltr)],
            []
        )
    );

const createNewGame = ({ room }) => {
    return Game.create({
        room,
        status: 'NOT_STARTED',
        players: [],
        letters: {
            revealed: [],
            hidden: _generateInitialLetterPool()
        }
    });
};

const findActiveGameByRoom = room => {
    return Game.findOne({
        room,
        status: { $in: ['NOT_STARTED', 'IN_PROGRESS'] }
    });
};

module.exports = {
    createNewGame,
    findActiveGameByRoom
};
