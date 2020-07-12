/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'react-router-dom';
import { Flex, NavLink, Text } from 'theme-ui';

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
        <Flex as="nav" sx={{ justifyContent: 'space-between' }}>
            <div>
                <NavLink as={Link} to="/" p={2}>
                    Home
                </NavLink>
                <NavLink as={Link} to="/about" p={2}>
                    About
                </NavLink>
                <NavLink onClick={handleLeaveRoom} href="#" p={2}>
                    Leave Room
                </NavLink>
            </div>
            <Flex sx={{ flexDirection: 'row' }} p={2}>
                {player && player.name && (
                    <Text mr={2}>
                        <span sx={{ fontWeight: 'bold' }}>Name:</span>{' '}
                        <span>{player.name}</span>
                    </Text>
                )}
                {room && (
                    <Text>
                        <span sx={{ fontWeight: 'bold' }}>Room:</span>{' '}
                        <span>{room}</span>
                    </Text>
                )}
            </Flex>
        </Flex>
    );
}

export default Nav;
