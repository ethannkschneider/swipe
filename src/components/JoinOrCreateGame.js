/** @jsx jsx */
import { jsx } from 'theme-ui';
import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import CreateGameForm from './CreateGameForm';
import JoinGameForm from './JoinGameForm';

function CustomTab({ children, selected }) {
    return (
        <Tab
            sx={{
                display: 'inline-block',
                borderStyle: 'solid',
                borderColor: 'muted',
                borderWidth: '1px',
                borderBottom: 'none',
                bottom: '-1px',
                position: 'relative',
                listStyle: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
                borderTopRightRadius: '4px',
                borderTopLeftRadius: '4px',
                color: 'primary',
                backgroundColor: selected ? 'background' : 'muted'
                // backgroundColor: theme => selected ? theme.colors.gray[5] : theme.colors
            }}
            className="bg-white"
        >
            {children}
        </Tab>
    );
}

CustomTab.tabsRole = 'Tab';

function JoinOrCreateGame() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Tabs
            selectedIndex={selectedIndex}
            onSelect={idx => setSelectedIndex(idx)}
            className="w-1/2 mx-auto"
        >
            <TabList className="flex justify-center">
                <CustomTab selected={selectedIndex === 0}>Join game</CustomTab>
                <CustomTab selected={selectedIndex === 1}>
                    Create game
                </CustomTab>
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

export default JoinOrCreateGame;
