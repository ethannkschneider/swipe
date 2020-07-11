require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const { body } = require('express-validator');

const game = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve('build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/game.html'));
});

io.on('connection', socket => {
    game.initGame(io, socket);
});

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
