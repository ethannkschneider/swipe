/** @jsx jsx */
import { jsx } from 'theme-ui';

import Game from './Game';
import JoinOrCreateGame from './JoinOrCreateGame';
import { useGameState } from './GameStateProvider';

function Home() {
    const gameState = useGameState();

    if (gameState.room) return <Game />;

    return <JoinOrCreateGame />;
}

export default Home;
