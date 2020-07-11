import React, { useState } from 'react';

import { useGameState } from './GameStateProvider';
import { useSocket } from './SocketProvider';
import WaitingScreen from './WaitingScreen';

function Game() {
    const {
        room,
        player,
        gameState: {
            progress,
            flippedTiles,
            numUnflippedTiles,
            currentPlayerName
        }
    } = useGameState();
    const [word, setWord] = useState('');

    const socket = useSocket(room);

    if (progress === 'notStarted') {
        return <WaitingScreen />;
    }
    if (progress === 'gameOver') {
        return <div>finished</div>;
    }

    const handleFlip = e => {
        e.preventDefault();
        socket.emit('flipTile', { name: player.name, roomId: room });
    };

    const handleUpdateWord = e => {
        setWord(e.target.value);
    };

    const handleTakeWord = e => {
        e.preventDefault();
        socket.emit('takeNewWord', { word, roomId: room, name: player.name });
        setWord('');
    };

    return (
        <div>
            <h2>Room: {room} </h2>
            <p>Your name: {player.name}</p>
            <p>Flipped tiles: {flippedTiles}</p>
            <p>Hidden tiles: {numUnflippedTiles}</p>
            {player.name === currentPlayerName && (
                <button onClick={handleFlip}>Flip</button>
            )}
            <h4>Your Words:</h4>
            <ul>
                {player.words.map((word, i) => (
                    <li key={i}>{word}</li>
                ))}
            </ul>
            <form onSubmit={handleTakeWord}>
                <input value={word} onChange={handleUpdateWord} />
                <button>Take word</button>
            </form>
        </div>
    );
}

export default Game;
