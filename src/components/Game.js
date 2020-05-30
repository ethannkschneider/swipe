import React from 'react';

import { useGame } from '../gameContext';

function Game() {
    const [{ game }, gameDispatch] = useGame();
    const { room, players } = game;

    console.log(game);

    return (
        <div>
            <h2>Game: {room} </h2>
            <p>Players: {players.map(player => player.name).join(', ')}</p>
        </div>
    );
}

export default Game;
