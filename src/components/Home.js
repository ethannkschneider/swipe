import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import CreateGameForm from './CreateGameForm';
import JoinGameForm from './JoinGameForm';
import Game from './Game';
import { useGameState } from './GameStateProvider';

function Home() {
    const gameState = useGameState();

    if (gameState.room) return <Game />;
    return (
        <Tabs>
            <TabList>
                <Tab>Join Game</Tab>
                <Tab>Create Game</Tab>
            </TabList>

            <TabPanel>
                <JoinGameForm />
            </TabPanel>
            <TabPanel>
                <CreateGameForm />
            </TabPanel>
        </Tabs>
    );
}

export default Home;
