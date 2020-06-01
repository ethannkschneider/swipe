const gameService = require('../game');

// server types
// const PLAYER_JOINED = 'PLAYER_JOINED';
// const GAME_STARTED = 'GAME_STARTED';
// const GAME_OVER = 'GAME_OVER';
// const INVALID_WORD = 'INVALID_WORD';
// const ILLEGAL_ACTION = 'ILLEGAL_ACTION';

// // client types
// const LETTER_FLIPPED = 'LETTER_FLIPPED';
// const WORD_MADE = 'WORD_MADE';
// const WORD_STOLEN = 'WORD_STOLEN';
// const JOIN_ROOM = 'JOIN_ROOM';

class SocketHandler {
    constructor(io) {
        this._io = io;
    }

    _broadcastToRoom(room, msgType, data) {
        this._io.sockets.in(room).emit(msgType, JSON.stringify(data));
    }

    _onDisconnect(socket) {
        console.log('disconnected');
    }

    async _onJoinRoom(socket, room) {
        socket.join(room);
        const game = await gameService.findActiveGameByRoom(room);
        this._broadcastToRoom(room, 'player_joined', game.players);
    }

    setupSockets() {
        this._io.on('connection', socket => {
            socket.on('disconnect', () => this._onDisconnect(socket));
            socket.on(
                'join_room',
                async data => await this._onJoinRoom(socket, data)
            );
        });
    }
}

module.exports = {
    SocketHandler
};
