import React from 'react';
import { Button, Text, Flex } from 'theme-ui';

import { useGameState } from './GameStateProvider';
import { usePlayerState } from './PlayerStateProvider';
import { useSocket } from './SocketProvider';

function WaitingScreen() {
    const { room, players } = useGameState();
    const player = usePlayerState();
    const socket = useSocket();

    const handleStartGame = e => {
        e.preventDefault();
        socket.emit('startGame', { roomId: room });
    };

    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <div className="mb-2">
                <Text sx={{ fontWeight: 'bold' }} className="mb-2">
                    Waiting for more players...
                </Text>
            </div>
            <div className="mb-2">
                <Text>Players: {players.map(pl => pl.name).join(', ')}</Text>
            </div>
            {player.isHost && (
                <div className="mb-2">
                    <Button
                        onClick={handleStartGame}
                        disabled={players.length < 2}
                        variant={players.length < 2 ? 'disabled' : 'primary'}
                    >
                        Start Game
                    </Button>
                </div>
            )}
        </Flex>
    );
}

export default WaitingScreen;
