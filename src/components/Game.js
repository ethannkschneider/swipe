import React, { useEffect } from 'react';

import { useGame } from '../gameContext';
import { useSocket } from '../hooks/sockets';

function Game() {
    const [{ room, player }, gameDispatch] = useGame();

    useSocket();

    return (
        <div>
            <h2>Room: {room} </h2>
            <p>Your name: {player.name}</p>
        </div>
    );
}

export default Game;
