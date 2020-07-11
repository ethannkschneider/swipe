import React from 'react';

import { useGameState } from './GameStateProvider';
import { useSocket } from './SocketProvider';

function WaitingScreen() {
    const { room, player, gameState } = useGameState();
    const socket = useSocket();

    const handleStartGame = e => {
        e.preventDefault();
        socket.emit('startGame', { roomId: room });
    };

    return (
        <div>
            <p>Waiting for more players...</p>
            {player.isHost && (
                <button
                    onClick={handleStartGame}
                    disabled={gameState.players.length < 2}
                >
                    Start Game
                </button>
            )}
            <ul>
                {gameState.players.map(player => (
                    <li key={player.name}>{player.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default WaitingScreen;
