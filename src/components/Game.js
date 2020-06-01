import React, { useEffect } from 'react';

import { useGame } from '../gameContext';
import { useSocket } from '../hooks/sockets';

function Game() {
    const [{ room, player, game }, gameDispatch] = useGame();

    const shouldShowStartButton =
        game.status === 'NOT_STARTED' && player.isCreator;

    const socket = useSocket(room);

    console.log({ socket });

    return (
        <div>
            <h2>Room: {room} </h2>
            <p>Your name: {player.name}</p>
            {shouldShowStartButton && (
                <button disabled={game.players.length < 2}>Start Game</button>
            )}
            <ul>
                {game.players.map(player => (
                    <li key={player._id}>{player.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Game;
