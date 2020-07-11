import React from 'react';
import { Link } from 'react-router-dom';

import { useGameState } from './GameStateProvider';

function Nav() {
    const { room, currentPlayer } = useGameState();

    const handleLeaveRoom = e => {
        localStorage.removeItem('swipe-game');
        window.location.reload();
    };

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>Room: {room}</li>
                <li>
                    <button onClick={handleLeaveRoom}>Leave room</button>
                </li>
                {currentPlayer && <li>Player: {currentPlayer.name}</li>}
            </ul>
        </nav>
    );
}

export default Nav;
