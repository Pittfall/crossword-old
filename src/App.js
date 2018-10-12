import React, { Component } from 'react';
import classes from './App.css';
import Grid from './containers/Grid/Grid';

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <Grid />
      </div>
    );
  }
}

export default App;
