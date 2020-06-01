require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const { body } = require('express-validator');

const { SocketHandler } = require('./services/sockets');

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
    const socketHandler = new SocketHandler(socketIO(server));

    socketHandler.setupSockets();

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
            console.log('/game/create');
            const { name, room } = req.body;
            try {
                const existingGame = await gameService.findActiveGameByRoom(
                    room
                );
                if (existingGame)
                    return next(
                        new Error('Game with that name already exists')
                    );
            } catch (error) {
                return next(new Error('Error finding an active game by room'));
            }
            const game = await gameService.createNewGame({ room });
            const player = await playerService.createNewPlayer({
                name,
                game,
                isCreator: true
            });

            await gameService.addPlayer(player, game);

            res.send({ player, room: game.room });
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
            console.log('/game/join');
            const { name, room } = req.body;
            let game;
            try {
                game = await gameService.findActiveGameByRoom(room);
            } catch (error) {
                return next(new Error('Error occurred while finding game'));
            }
            if (!game)
                return next(new Error('Sorry, that room does not exist'));

            const player = await playerService.createNewPlayer({
                name,
                game
            });

            await gameService.addPlayer(player, game);

            res.send({ player, room: game.room });
        }
    );

    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });
}

if (require.main === module) {
    main();
}
