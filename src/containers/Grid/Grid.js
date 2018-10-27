import React, { Fragment, Component } from 'react';

import Square from '../../components/Square/Square';
import Keyboard from '../../components/Keyboard/Keyboard';

import { CLUE_DIRECTION } from '../../constants/constants';
import { mockPuzzle } from '../../CrosswordData/NYTData/NYTData';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './Grid.module.css';

class Grid extends Component {
  state = {
    gridValues: null,
    clueDirection: CLUE_DIRECTION.Down,
    puzzleData: null
  }

  componentDidMount () {
    mockPuzzle()
    .then (data => {
      const grid = new Array(data.columns * data.rows);

      for (let i = 0; i < grid.length; i++) {
        grid[i] = {focus: false, type: data.grid[i].type, value: ''};
      }

      this.setState({
        gridValues: grid,
        puzzleData: data
      });
    })
    .catch (error => {

    });
  }

  squareClickedHandler = (index) => {
    const grid = [...this.state.gridValues];

    for (let i = 0; i < grid.length; i++) {
      if (i === index) {
        grid[i] = {...grid[i], focus: true};
      } else {
        grid[i] = {...grid[i], focus: false};
      }
    }

    this.setState({gridValues: grid})
  }

  getNextSquarePoints = (currentElement) => {
    let gotValidSquare = false;
    let nextElement = currentElement;

    while(!gotValidSquare) {
      if (this.state.clueDirection === CLUE_DIRECTION.Across) {
        nextElement++;

        if (nextElement >= this.state.gridValues.length) {
          nextElement = 0;
        }
      }
  
      if (this.state.clueDirection === CLUE_DIRECTION.Down) {
        nextElement += this.state.puzzleData.columns;

        if (nextElement >= this.state.gridValues.length) {
          nextElement = (nextElement - this.state.gridValues.length) + 1;
        }
      }

      if (this.state.gridValues[nextElement].type !== 'B') {
        gotValidSquare = true;
      }
    }
    
    return nextElement;
  }

  keyPressedHandler = (button) => {
    const grid = [...this.state.gridValues];

    for (let i = 0; i < grid.length; i++) {
      if (grid[i].focus) {
        grid[i] = {...grid[i], value: button};
        grid[i].focus = false;
        const nextElement = this.getNextSquarePoints(i);
        grid[nextElement].focus = true;
        this.setState({gridValues: grid});
        return;
      }
    }
  }

  render () {
    let squares = null;
    let key = 0;

    if (this.state.gridValues) {
      squares = [];
      for (let i = 0; i < this.state.gridValues.length; i++) {
          squares.push(
            <Square key={key++} 
              focused={this.state.gridValues[i].focus}
              value = {this.state.gridValues[i].value}
              type={this.state.gridValues[i].type} 
              clicked={() => this.squareClickedHandler(i)} />);
      }
    }

    let content = <Spinner />;

    if (squares) {
      content = <div className={classes.Grid}>
        {squares}
        <Keyboard keyPress={(button) => this.keyPressedHandler(button)} />
      </div>
    }
    
    return (
      <Fragment>
        {content}
      </Fragment>
    );
  }
}

export default Grid;