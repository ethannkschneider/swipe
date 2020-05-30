require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const { body } = require('express-validator');

const setupSockets = require('./sockets');

const Game = require('./models/Game');
const Player = require('./models/Player');
const playerService = require('./services/player');
const gameService = require('./services/game');

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);

    // setupSockets(io);

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(path.resolve('build')));

    app.post(
        '/game/create',
        [
            body('name')
                .not()
                .isEmpty()
                .trim()
                .escape(),
            body('room')
                .isLength({ min: 3 })
                .trim()
                .escape()
        ],
        async (req, res, next) => {
            const { name, room } = req.body;
            const game = await gameService.createNewGame({ room });
            const player = await playerService.createNewPlayer({ name, game });
            res.send({ player, game });
        }
    );

    app.post(
        '/game/join',
        [
            body('name')
                .not()
                .isEmpty()
                .trim()
                .escape(),
            body('room')
                .isLength({ min: 3 })
                .trim()
                .escape()
        ],
        async (req, res, next) => {
            const { name, room } = req.body;
            const game = gameService.findActiveGameByRoom(room);
            if (!game)
                return next(new Error('Sorry, that room does not exist'));

            const player = await playerService.createNewPlayer({
                name,
                game
            });

            res.send({ player: player.name, room: game.room });
        }
    );

    app.get('/play/:room', async (req, res, next) => {
        const room = req.params.room;
    });

    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });
}

if (require.main === module) {
    main();
}
