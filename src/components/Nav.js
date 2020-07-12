import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, NavLink } from 'theme-ui';

import { useGameState } from './GameStateProvider';
import { usePlayerState } from './PlayerStateProvider';

function Nav() {
    const { room } = useGameState();
    const player = usePlayerState();

    const handleLeaveRoom = e => {
        localStorage.removeItem('swipe-game');
        window.location.reload();
    };

    return (
        <Flex as="nav">
            <NavLink as={Link} to="/" p={2}>
                Home
            </NavLink>
            <NavLink as={Link} to="/about" p={2}>
                About
            </NavLink>
            <NavLink onClick={handleLeaveRoom} href="#" p={2}>
                Leave Room
            </NavLink>
        </Flex>
        // <nav>
        //     <ul>
        //         <li>
        //             <Link to="/">Home</Link>
        //         </li>
        //         <li>
        //             <Link to="/about">About</Link>
        //         </li>
        //         <li>Room: {room}</li>
        //         <li>
        //             <button onClick={handleLeaveRoom}>Leave room</button>
        //         </li>
        //         {player && <li>Player: {player.name}</li>}
        //     </ul>
        // </nav>
    );
}

export default Nav;
