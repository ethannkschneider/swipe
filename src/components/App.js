import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { GameProvider } from '../gameContext';
import Nav from './Nav';
import Home from './Home';
import '../App.css';

function About() {
    return <h2>About</h2>;
}

function App() {
    return (
        <Router>
            <GameProvider>
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
            </GameProvider>
        </Router>
    );
}

export default App;
