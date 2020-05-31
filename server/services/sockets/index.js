const gameService = require('../game');

// server types
const PLAYER_JOINED = 'PLAYER_JOINED';
const GAME_STARTED = 'GAME_STARTED';
const GAME_OVER = 'GAME_OVER';
const INVALID_WORD = 'INVALID_WORD';
const ILLEGAL_ACTION = 'ILLEGAL_ACTION';

// client types
const LETTER_FLIPPED = 'LETTER_FLIPPED';
const WORD_MADE = 'WORD_MADE';
const WORD_STOLEN = 'WORD_STOLEN';
const JOIN_ROOM = 'JOIN_ROOM';

function setupSockets(io) {
    const onPlayerJoined = async (socket, { room }) => {
        socket.join(room);
        console.log('joined room: ', room);
        const game = await gameService.findActiveGameByRoom(room);
        io.sockets
            .in(room)
            .emit('player_joined', JSON.stringified(game.players));
    };

    const onDisconnect = () => {
        console.log('disconnected');
    };
    io.on('connection', socket => {
        socket.on('join_game', data => onPlayerJoined(socket, data));
        socket.on('disconnect', () => onDisconnect(socket));
    });
}

module.exports = {
    setupSockets
};
