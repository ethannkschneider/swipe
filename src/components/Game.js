/** @jsx jsx */
import { jsx, Text, Flex } from 'theme-ui';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useGameState } from './GameStateProvider';
import { usePlayerState, usePlayer } from './PlayerStateProvider';
import { useSocket } from './SocketProvider';
import WaitingScreen from './WaitingScreen';
import Opponent from './Opponent';
import Input from './Input';
import Form from './Form';
import * as UTILS from '../utils';

function Game() {
    const {
        room,
        progress,
        flippedTiles,
        numUnflippedTiles,
        players,
        currentPlayerName
    } = useGameState();
    const player = usePlayerState();
    const [currWord, setCurrWord] = useState('');

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
        setCurrWord(e.target.value);
    };

    const clearWord = () => {
        setCurrWord('');
    };

    const isNewWordValid = () => {
        return (
            currWord.length >= 4 &&
            UTILS.canWordBeFormedFromLetters(currWord, flippedTiles)
        );
    };

    const handleTakeWord = e => {
        e.preventDefault();
        if (!isNewWordValid()) {
            toast.error('Invalid word');
            return;
        }
        socket.emit('takeNewWord', {
            word: currWord,
            roomId: room,
            name: player.name
        });
        clearWord();
    };

    return (
        <Flex sx={{ flexDirection: 'column' }}>
            <Flex>
                {players
                    .filter(pl => pl.name !== player.name)
                    .map(pl => (
                        <Opponent key={`opponent-${pl.name}`} {...pl} />
                    ))}
                <Text></Text>
            </Flex>
            <p>Flipped tiles: {flippedTiles}</p>
            <p>Hidden tiles: {numUnflippedTiles}</p>
            {player.name === currentPlayerName && (
                <button onClick={handleFlip}>Flip</button>
            )}
            <div>Points: {player.words.join('').length}</div>
            <h4>Your Words:</h4>
            <ul>
                {player.words.map((word, i) => (
                    <li key={i}>{word}</li>
                ))}
            </ul>
            <h5>Other players: </h5>
            <div>
                {players.map(otherPlayer => (
                    <div>
                        {otherPlayer.name}:{' '}
                        {otherPlayer.words.map((word, i) => (
                            <div key={i}> {word}</div>
                        ))}
                    </div>
                ))}
            </div>
            <h5>Log:</h5>
            <div></div>
            <Form onSubmit={handleTakeWord}>
                <Input value={currWord} onChange={handleUpdateWord} />
                <button>Take word</button>
            </Form>
        </Flex>
    );
}

export default Game;
