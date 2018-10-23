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
    clueDirection: CLUE_DIRECTION.Across,
    puzzleData: null
  }

  componentDidMount () {
    mockPuzzle()
    .then (data => {
      const grid = new Array(data.columns);

      let counter = 0;
      for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(data.rows);
        for (let j = 0; j < grid[i].length; j++) {
          grid[i][j] = {focus: false, type: data.gridNums[counter], value: ''};
          counter++;
        }
      }

      this.setState({
        gridValues: grid,
        puzzleData: data
      });
    })
    .catch (error => {

    });
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

  getNextSquarePoints = (grid, currentRow, currentColumn) => {
    let gotValidSquare = false;

    while(!gotValidSquare) {
      if (this.state.clueDirection === CLUE_DIRECTION.Across) {
        if (currentColumn + 1 > grid[currentRow].length - 1) {
          currentColumn = 0;
          currentRow = currentRow + 1 > grid.length - 1 ? 0 : currentRow + 1;
        } else {
          currentColumn += 1;
        }
      }
  
      if (this.state.clueDirection === CLUE_DIRECTION.Down) {
        if (currentRow + 1 > grid.length - 1) {
          currentRow = 0;
          currentColumn = currentColumn + 1 > grid[currentRow].length - 1 ? 0 : currentColumn + 1;
        } else {
          currentRow += 1;
        }
      }

      if (grid[currentRow][currentColumn].type !== 'B') {
        gotValidSquare = true;
      }
    }
    
    return [currentRow, currentColumn];
  }

  keyPressedHandler = (button) => {
    const grid = [...this.state.gridValues];

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j].focus) {
          grid[i][j] = {...grid[i][j], value: button};
          const nextSquarePoints = this.getNextSquarePoints(grid, i, j);
          grid[i][j].focus = false;
          grid[nextSquarePoints[0]][nextSquarePoints[1]].focus = true;
          this.setState({gridValues: grid});
          return;
        }
      }
    }
  }

  render () {
    let squares = null;
    let key = 0;

    if (this.state.gridValues) {
      squares = [];
      for (let i = 0; i < this.state.puzzleData.columns; i++) {
        for (let j = 0; j < this.state.puzzleData.rows; j++) {
          squares.push(
            <Square key={key++} 
              focused={this.state.gridValues[i][j].focus}
              value = {this.state.gridValues[i][j].value}
              type={this.state.gridValues[i][j].type} 
              clicked={() => this.squareClickedHandler(i, j)} />);
        }
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