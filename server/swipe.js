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
        this.gameState = {
            progress: 'notStarted',
            players,
            unflippedTiles: Swipe.generateInitialLetters(),
            flippedTiles: [],
            currentPlayerName: players[0].name
        };
    }

    getPublicState() {
        return {
            room: this.roomId,
            gameState: _.merge(
                {},
                _.pick(this.gameState, [
                    'progress',
                    'players',
                    'flippedTiles',
                    'turn'
                ]),
                {
                    currentPlayerName: this.getCurrentPlayer().name,
                    numUnflippedTiles: this.gameState.unflippedTiles.length
                }
            )
        };
    }

    addNewPlayer(name) {
        const newPlayer = Swipe.createNewPlayer({ name, isHost: false });
        this.gameState.players.push(newPlayer);
    }

    start() {
        this.gameState.progress = 'inProgress';
        this.shufflePlayers();
    }

    nextTurn() {
        this._turnIdx = (this._turnIdx + 1) % this.gameState.players.length;
    }

    flipTile() {
        const letter = this.gameState.unflippedTiles.pop();
        this.gameState.flippedTiles.push(letter);
        this.nextTurn();
    }

    getCurrentPlayer() {
        return this.gameState.players[this._turnIdx];
    }

    isTurnOf(name) {
        return this.getCurrentPlayer().name === name;
    }

    shufflePlayers() {
        shuffleArray(this.gameState.players);
    }

    isNewWordValid(word) {
        let isValid = true;
        const flippedTiles = [...this.gameState.flippedTiles];

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
            this.gameState.flippedTiles.splice(idx, 1);
        });

        const playerIdx = _.findIndex(
            this.gameState.players,
            player => player.name === name
        );
        const player = this.gameState.players[playerIdx];
        player.words.push(word);
        this.setTurnIdx(playerIdx);
    }

    setTurnIdx(idx) {
        this._turnIdx = idx;
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
            points: 0,
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
