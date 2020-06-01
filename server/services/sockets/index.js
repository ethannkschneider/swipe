const gameService = require('../game');
const playerService = require('../player');

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
        console.log(
            `broadcasting the following message of type ${msgType} to room ${room}:`
        );
        console.log(data);
        this._io.sockets.in(room).emit(msgType, JSON.stringify(data));
    }

    async _onDisconnect(socket) {
        console.log('disconnected');
        console.log('id:', socket.id);
        const player = await playerService.findBySocketId(socket.id);
        const { room, players } = player.game;
        this._broadcastToRoom(room, 'player_disconnected', {
            name: player.name,
            players
        });
    }

    _onJoinRoom(socket, data) {
        const { room, playerId } = JSON.parse(data);
        console.log('trying to join room', room);
        socket.join(room, async () => {
            console.log('player joined');
            console.log('socket.rooms');
            console.log(Object.keys(socket.rooms));
            const player = await playerService.updateSocketId(
                playerId,
                socket.id
            );
            const game = await gameService.findActiveGameByRoom(room);
            this._broadcastToRoom(room, 'player_joined', {
                name: player.name,
                players: game.players
            });
        });
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
