import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Cart from './pages/Cart';
import Details from './pages/Details';
import Search from './pages/Search';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ Search } />
          <Route exact path="/cart" component={ Cart } />
          <Route exact path="/:id" component={ Details } />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
