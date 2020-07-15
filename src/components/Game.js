/** @jsx jsx */
import { jsx, Text, Flex, Button } from 'theme-ui';
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
        <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Flex>
                {players
                    .filter(pl => pl.name !== player.name)
                    .map(pl => (
                        <Opponent
                            key={`opponent-${pl.name}`}
                            name={pl.name}
                            words={pl.words}
                        />
                    ))}
            </Flex>
            <p>Flipped tiles: {flippedTiles}</p>
            <p>Hidden tiles: {numUnflippedTiles}</p>
            {player.name === currentPlayerName && (
                <button onClick={handleFlip}>Flip</button>
            )}
            {/* <div>Points: {player.words.join('').length}</div> */}
            {/* <h4>Your Words:</h4>
            <ul>
                {player.words.map((word, i) => (
                    <li key={i}>{word}</li>
                ))}
            </ul> */}
            {/* <h5>Other players: </h5>
            <div>
                {players.map(otherPlayer => (
                    <div>
                        {otherPlayer.name}:{' '}
                        {otherPlayer.words.map((word, i) => (
                            <div key={i}> {word}</div>
                        ))}
                    </div>
                ))}
            </div> */}
            {/* <h5>Log:</h5>
            <div></div> */}

            <div className="w-full max-w-xl m-auto">
                <Flex
                    sx={{ flexDirection: 'column', alignItems: 'center' }}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    <Text sx={{ fontSize: theme => theme.fontSizes[4] }}>
                        {player.name}
                    </Text>
                    <form onSubmit={handleTakeWord} noValidate className="mb-3">
                        <div className="mb-3">
                            <Input
                                value={currWord}
                                onChange={handleUpdateWord}
                                placeholder="Enter a word to take"
                            />
                        </div>
                        <Flex sx={{ justifyContent: 'center' }}>
                            <Button>Take word</Button>
                        </Flex>
                    </form>
                    <Flex sx={{ width: '100%', flexWrap: 'wrap' }}>
                        {player.words.map((word, i) => (
                            <div
                                className="py-1 px-5 mx-1 my-1"
                                sx={{
                                    background: theme => theme.colors.purple[2],
                                    borderRadius: '6px',
                                    border: theme =>
                                        `2px solid ${theme.colors.purple[3]}`
                                }}
                            >
                                <Text>{word}</Text>
                            </div>
                        ))}
                    </Flex>
                    <Flex sx={{ justifyContent: 'flex-end', width: '100%' }}>
                        <Text>
                            Points: {UTILS.calculatePoints(player.words)}
                        </Text>
                    </Flex>
                </Flex>
            </div>
        </Flex>
    );
}

export default Game;
