import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Navigation from './Navigation';
import Home from './Home';
import Search from './Search';
import Roulette from './Roulette';
import About from './About';
import Account from './Account';
import Footer from './Footer';


class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/search" component={Search} />
          <Route path="/roulette" component={Roulette} />
          <Route path="/about" component={About} />
          <Route path="/account" component={Account} />
        </Switch>
        <Footer />
      </div >
    );
  }
}
export default App;
