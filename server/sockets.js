const GameController = require('./gameController');

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

class IoHandler {
    constructor(io) {
        this._io = io;
    }

    onConnection = socket => {
        const socketHandler = new SocketHandler(this._io, socket);
        socket.on('player_joined', socketHandler.onPlayerJoined);
        socket.on('disconnect', socketHandler.onDisconnect);
    };
}

class SocketHandler {
    constructor(io, socket) {
        this.__io = io;
        this.__socket = socket;
        this.__gameController = null;
    }

    onPlayerJoined = async ({ room, name }) => {
        this.__gameController = new GameController({
            io: this.__io,
            socket: this.__socket,
            room
        });

        this.__gameController.addPlayer(name);
        this.__socket.join(room);
    };

    onDisconnect = () => {
        console.log('disconnected');
    };
}

module.exports = io => {
    const ioHandler = new IoHandler(io);
    io.on('connection', ioHandler.onConnection);
};
