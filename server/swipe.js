const _ = require('lodash');

const LETTER_FREQUENCIES = new Map([
    ['a', 9],
    ['b', 2],
    ['c', 2],
    ['d', 4],
    ['e', 12],
    ['f', 2],
    ['g', 3],
    ['h', 2],
    ['i', 9],
    ['j', 1],
    ['k', 1],
    ['l', 4],
    ['m', 2],
    ['n', 6],
    ['o', 8],
    ['p', 2],
    ['q', 1],
    ['r', 6],
    ['s', 4],
    ['t', 6],
    ['u', 4],
    ['v', 2],
    ['w', 2],
    ['x', 1],
    ['y', 2],
    ['z', 1]
]);

class Swipe {
    constructor(roomId, players) {
        this._turnIdx = 0;
        this.roomId = roomId;
        this.progress = 'notStarted';
        this.players = players;
        this.unflippedTiles = Swipe.generateInitialLetters();
        this.flippedTiles = [];
        this.currentPlayerName = players[0].name;
    }

    getPublicState() {
        return {
            room: this.roomId,
            progress: this.progress,
            players: this.players,
            flippedTiles: this.flippedTiles,
            currentPlayerName: this.getCurrentPlayer().name,
            numUnflippedTiles: this.unflippedTiles.length
        };
    }

    addNewPlayer(name) {
        const newPlayer = Swipe.createNewPlayer({ name, isHost: false });
        this.players.push(newPlayer);
    }

    start() {
        this.progress = 'inProgress';
        this.shufflePlayers();
    }

    nextTurn() {
        this._turnIdx = (this._turnIdx + 1) % this.players.length;
    }

    flipTile() {
        const letter = this.unflippedTiles.pop();
        this.flippedTiles.push(letter);
        this.nextTurn();
    }

    getCurrentPlayer() {
        return this.players[this._turnIdx];
    }

    isTurnOf(name) {
        return this.getCurrentPlayer().name === name;
    }

    shufflePlayers() {
        shuffleArray(this.players);
    }

    isNewWordValid(word) {
        let isValid = true;
        const flippedTiles = [...this.flippedTiles];

        word.toLowerCase()
            .split('')
            .forEach(ltr => {
                const ltrIdx = _.findIndex(flippedTiles, tile => tile === ltr);
                if (ltrIdx < 0) {
                    isValid = false;
                    return;
                }
                flippedTiles.splice(ltrIdx, 1);
            });

        return isValid;
    }

    takeNewWord(word, name) {
        word.split('').forEach(ltr => {
            const idx = _.findIndex(ltr);
            this.flippedTiles.splice(idx, 1);
        });

        const playerIdx = _.findIndex(
            this.players,
            player => player.name === name
        );
        const player = this.players[playerIdx];
        player.words.push(word);
        this.setTurnIdx(playerIdx);
    }

    setTurnIdx(idx) {
        this._turnIdx = idx;
    }

    getPlayerByName(name) {
        return _.find(this.players, player => player.name === name);
    }

    static createNewGame(roomId, creatorName) {
        const players = [
            Swipe.createNewPlayer({ name: creatorName, isHost: true })
        ];

        return new Swipe(roomId, players);
    }

    static createNewPlayer({ name, isHost }) {
        return {
            name,
            isHost,
            words: []
        };
    }

    static generateInitialLetters() {
        const letters = Array.from(LETTER_FREQUENCIES.entries()).reduce(
            (acc, [ltr, freq]) => {
                return [...acc, ...new Array(freq).fill(ltr)];
            },
            []
        );
        shuffleArray(letters);

        return letters;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = Swipe;
