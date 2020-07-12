/** @jsx jsx */
import { jsx } from 'theme-ui';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import GameStateProvider from './GameStateProvider';
import PlayerStateProvider from './PlayerStateProvider';
import SocketProvider from './SocketProvider';
import ThemeProvider from './ThemeProvider';
import Nav from './Nav';
import Home from './Home';
import Title from './Title';

function About() {
    return <h2>About</h2>;
}

function App() {
    return (
        <Router>
            <GameStateProvider>
                <PlayerStateProvider>
                    <SocketProvider>
                        <ThemeProvider>
                            <Nav />
                            <Title>Swipe</Title>
                            <div className="container mx-auto">
                                <Switch>
                                    <Route path="/about">
                                        <About />
                                    </Route>
                                    <Route path="/">
                                        <Home />
                                    </Route>
                                </Switch>
                            </div>
                        </ThemeProvider>
                    </SocketProvider>
                </PlayerStateProvider>
            </GameStateProvider>
        </Router>
    );
}

export default App;
