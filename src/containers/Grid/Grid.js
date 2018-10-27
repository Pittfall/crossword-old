import React, { Fragment, Component } from 'react';

import Square from '../../components/Grid/Square/Square';
import Clue from '../../components/Grid/Clue/Clue';
import Keyboard from '../../components/Keyboard/Keyboard';
import Spinner from '../../UI/Spinner/Spinner';

import { CLUE_DIRECTION } from '../../constants/constants';
import { mockPuzzle } from '../../CrosswordData/NYTData/NYTData';

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
      const grid = new Array(data.size.columns * data.size.rows);

      for (let i = 0; i < grid.length; i++) {
        grid[i] = {focus: false, type: data.grid[i].type, value: ''};
      }

      grid[0].focus = true;

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
    let clueDirection = this.state.clueDirection;

    for (let i = 0; i < grid.length; i++) {
      if (i === index) {
        if (grid[i].focus) {
          clueDirection = (clueDirection === CLUE_DIRECTION.Across) ? CLUE_DIRECTION.Down : CLUE_DIRECTION.Across;
        }

        grid[i] = {...grid[i], focus: true};
      } else {
        grid[i] = {...grid[i], focus: false};
      }
    }

    this.setState({gridValues: grid, clueDirection: clueDirection});
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
        nextElement += this.state.puzzleData.size.columns;

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

  getClue = () => {
    let clueNumbers = {};
    for (let i = 0; i < this.state.gridValues.length; i++) {
      if (this.state.gridValues[i].focus) {
        clueNumbers = this.state.puzzleData.grid[i].clueNumber;
        break;
      }
    }
    let retClue = null;

    if (this.state.clueDirection === CLUE_DIRECTION.Across) {
      retClue = this.state.puzzleData.clues.across.find(key => {
        return +key.number === clueNumbers.across;
      });
    } else {
      retClue = this.state.puzzleData.clues.down.find(key => {
        return +key.number === clueNumbers.down;
      });
    }

    console.log(retClue);

    return retClue.clue;
  }

  render () {
    let squares = null;

    if (this.state.gridValues) {
      squares = [];
      for (let i = 0; i < this.state.gridValues.length; i++) {
          squares.push(
            <Square key={i}
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
        <Clue clue={this.getClue()} />
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