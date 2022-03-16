const Swipe = require('./swipe');

const games = new Map([]);
let io;
let gameSocket;

exports.initGame = function(sio, socket) {
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: 'You are connected!' });

    gameSocket.on('createGame', onCreateGame);
    gameSocket.on('startGame', onStartGame);
    gameSocket.on('joinGame', onJoinGame);
    gameSocket.on('flipTile', onFlipTile);
    gameSocket.on('takeNewWord', onTakeNewWord);
    // gameSocket.on('playerAnswer', playerAnswer);
    // gameSocket.on('playerRestart', playerRestart);
};

function onCreateGame(data) {
    const { roomId, name } = data;
    const room = io.sockets.adapter.rooms[roomId];
    if (room) {
        this.emit('err', { message: 'Sorry, that room name already exists!' });
        return;
    }

    const game = createNewGame(roomId, name);
    const player = game.players[0];
    player.socketId = this.id;
    this.join(roomId);
    this.emit('gameCreated', {
        player,
        game: game.getPublicState()
    });
}

function onJoinGame(data) {
    const { roomId, name } = data;
    const room = io.sockets.adapter.rooms[roomId];

    if (!room) {
        this.emit('err', { message: 'Sorry, that room does not exist!' });
        return;
    }
    if (room.length > 6) {
        this.emit('err', { message: 'Sorry, that room is full!' });
        return;
    }

    const game = findGameByRoomId(roomId);

    if (!game) {
        this.emit('err', { message: 'Sorry, that room does not exist' });
        return;
    }
    if (game.players.some(player => player.name === name)) {
        this.emit('err', {
            message:
                'Sorry, there is someone else in the same room with that name. Please pick a different name.'
        });
        return;
    }

    game.addNewPlayer(name);
    const player = game.getPlayerByName(name);
    player.socketId = this.id;

    this.join(roomId);

    this.emit('playerJoined', {
        player,
        game: game.getPublicState()
    });

    io.sockets.in(roomId).emit('newPlayerJoined', { game });
}

function onStartGame(data) {
    const { roomId } = data;

    validateRoomHasSocket(roomId);

    const game = findGameByRoomId(roomId);

    game.start();

    io.sockets.in(roomId).emit('gameStarted', { game: game.getPublicState() });
}

function onFlipTile(data) {
    const { roomId, name } = data;

    validateRoomHasSocket(roomId);

    const game = findGameByRoomId(roomId);

    if (!game.isTurnOf(name)) {
        this.emit('err', { message: "Sorry, it's not your turn!" });
        return;
    }

    game.flipTile();

    io.sockets.in(roomId).emit('tileFlipped', { game: game.getPublicState() });
}

function onTakeNewWord(data) {
    const { roomId, word, name } = data;

    validateRoomHasSocket(roomId);

    const game = findGameByRoomId(roomId);
    if (!game.isNewWordValid(word)) {
        this.emit('err', { message: `Invalid word: ${word}` });
        return;
    }

    game.takeNewWord(word, name);
    io.sockets.in(roomId).emit('wordTaken', { game: game.getPublicState() });
}

function createNewGame(roomId, name) {
    const game = Swipe.createNewGame(roomId, name);

    games.set(roomId, game);

    return game;
}

function findGameByRoomId(roomId) {
    return games.get(roomId);
}

function validateRoomHasSocket(roomId) {
    if (!gameSocket.rooms.hasOwnProperty(roomId)) {
        gameSocket.emit('err', { message: 'Wrong room!' });
        return;
    }
}
