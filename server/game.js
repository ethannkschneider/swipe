const { v4: uuidV4 } = require('uuid');

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

/* *************************
 *                       *
 *      GAME LOGIC       *
 *                       *
 ************************* */

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

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param wordPoolIndex
 * @param gameId The room identifier
 */
function sendWord(wordPoolIndex, gameId) {
    var data = getWordData(wordPoolIndex);
    io.sockets.in(data.gameId).emit('newWordData', data);
}

/**
 * This function does all the work of getting a new words from the pile
 * and organizing the data to be sent back to the clients.
 *
 * @param i The index of the wordPool.
 * @returns {{round: *, word: *, answer: *, list: Array}}
 */
function getWordData(i) {
    // Randomize the order of the available words.
    // The first element in the randomized array will be displayed on the host screen.
    // The second element will be hidden in a list of decoys as the correct answer
    var words = shuffle(wordPool[i].words);

    // Randomize the order of the decoy words and choose the first 5
    var decoys = shuffle(wordPool[i].decoys).slice(0, 5);

    // Pick a random spot in the decoy list to put the correct answer
    var rnd = Math.floor(Math.random() * 5);
    decoys.splice(rnd, 0, words[1]);

    // Package the words into a single object.
    var wordData = {
        round: i,
        word: words[0], // Displayed Word
        answer: words[1], // Correct Answer
        list: decoys // Word list for player (decoys and answer)
    };

    return wordData;
}

/*
 * Javascript implementation of Fisher-Yates shuffle algorithm
 * http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
 */
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Each element in the array provides data for a single round in the game.
 *
 * In each round, two random "words" are chosen as the host word and the correct answer.
 * Five random "decoys" are chosen to make up the list displayed to the player.
 * The correct answer is randomly inserted into the list of chosen decoys.
 *
 * @type {Array}
 */
var wordPool = [
    {
        words: ['sale', 'seal', 'ales', 'leas'],
        decoys: [
            'lead',
            'lamp',
            'seed',
            'eels',
            'lean',
            'cels',
            'lyse',
            'sloe',
            'tels',
            'self'
        ]
    },

    {
        words: ['item', 'time', 'mite', 'emit'],
        decoys: [
            'neat',
            'team',
            'omit',
            'tame',
            'mate',
            'idem',
            'mile',
            'lime',
            'tire',
            'exit'
        ]
    },

    {
        words: ['spat', 'past', 'pats', 'taps'],
        decoys: [
            'pots',
            'laps',
            'step',
            'lets',
            'pint',
            'atop',
            'tapa',
            'rapt',
            'swap',
            'yaps'
        ]
    },

    {
        words: ['nest', 'sent', 'nets', 'tens'],
        decoys: [
            'tend',
            'went',
            'lent',
            'teen',
            'neat',
            'ante',
            'tone',
            'newt',
            'vent',
            'elan'
        ]
    },

    {
        words: ['pale', 'leap', 'plea', 'peal'],
        decoys: [
            'sale',
            'pail',
            'play',
            'lips',
            'slip',
            'pile',
            'pleb',
            'pled',
            'help',
            'lope'
        ]
    },

    {
        words: ['races', 'cares', 'scare', 'acres'],
        decoys: [
            'crass',
            'scary',
            'seeds',
            'score',
            'screw',
            'cager',
            'clear',
            'recap',
            'trace',
            'cadre'
        ]
    },

    {
        words: ['bowel', 'elbow', 'below', 'beowl'],
        decoys: [
            'bowed',
            'bower',
            'robed',
            'probe',
            'roble',
            'bowls',
            'blows',
            'brawl',
            'bylaw',
            'ebola'
        ]
    },

    {
        words: ['dates', 'stead', 'sated', 'adset'],
        decoys: [
            'seats',
            'diety',
            'seeds',
            'today',
            'sited',
            'dotes',
            'tides',
            'duets',
            'deist',
            'diets'
        ]
    },

    {
        words: ['spear', 'parse', 'reaps', 'pares'],
        decoys: [
            'ramps',
            'tarps',
            'strep',
            'spore',
            'repos',
            'peris',
            'strap',
            'perms',
            'ropes',
            'super'
        ]
    },

    {
        words: ['stone', 'tones', 'steno', 'onset'],
        decoys: [
            'snout',
            'tongs',
            'stent',
            'tense',
            'terns',
            'santo',
            'stony',
            'toons',
            'snort',
            'stint'
        ]
    }
];
