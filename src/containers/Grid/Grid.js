import React, { Component } from 'react';

import Square from '../../components/Square/Square';

import { MockPuzzle } from '../../MockPuzzle/MockPuzzle';

import classes from './Grid.module.css';

class Grid extends Component {
  state = {
    gridValues: null
  }

  componentDidMount () {
    const grid = new Array(15);

    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(15);
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j] = {focus: false};
      }
    }

    this.setState({gridValues: grid})
  }

  squareClickedHandler = (row, col) => {
    const grid = [...this.state.gridValues];

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (i === row && j === col) {
          grid[i][j] = {...grid[i][j], focus: true};
        } else {
          grid[i][j] = {...grid[i][j], focus: false};
        }
      }
    }

    this.setState({gridValues: grid})
  }

  squareKeyDownHandler = (event, row, col) => {
    if (event.key.match(/[a-z]/i)) {
      const grid = [...this.state.gridValues];

      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (i === row && j === col) {
            grid[i][j] = {...grid[i][j], value: event.key.toUpperCase()};
          }
        }
      }

      this.setState({gridValues: grid})
    }
  }

  render () {
    let squares = null;
    let key = 0;

    if (this.state.gridValues) {
      squares = [];
      for (let i = 0; i < MockPuzzle.length; i++) {
        for (let j = 0; j < MockPuzzle[i].length; j++) {
          squares.push(
            <Square key={key++} 
              focused={this.state.gridValues[i][j].focus}
              value = {this.state.gridValues[i][j].value}
              type={MockPuzzle[i][j]} 
              clicked={() => this.squareClickedHandler(i, j)} 
              keyDown = {(event) => this.squareKeyDownHandler(event, i, j)}/>);
        }
      }
    }
    
    return (
      <div className={classes.Grid}>
        {squares}
      </div>
    );
  }
}

export default Grid;