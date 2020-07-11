import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import GameStateProvider from './GameStateProvider';
import SocketProvider from './SocketProvider';
import Nav from './Nav';
import Home from './Home';
import '../App.css';

function About() {
    return <h2>About</h2>;
}

function App() {
    return (
        <Router>
            <GameStateProvider>
                <SocketProvider>
                    <Nav />
                    <div className="App">
                        <Switch>
                            <Route path="/about">
                                <About />
                            </Route>
                            <Route path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </div>
                </SocketProvider>
            </GameStateProvider>
        </Router>
    );
}

export default App;
