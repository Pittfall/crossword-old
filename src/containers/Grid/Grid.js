import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

import Square from '../../components/Grid/Square/Square';
import Clue from '../../components/Grid/Clue/Clue';
import Keyboard from '../../components/Keyboard/Keyboard';
import Spinner from '../../UI/Spinner/Spinner';

import { CLUE_DIRECTION, SQUARE_TYPE } from '../../constants/constants';
import { NYTPuzzle } from '../../CrosswordData/NYTData/NYTData';
import { initCrossword } from '../../store/actions/grid';

import classes from './Grid.module.css';

class Grid extends Component {
  state = {
    gridValues: null,
    clueDirection: CLUE_DIRECTION.Across,
    puzzleData: null
  }

  componentDidMount () {
    NYTPuzzle('2017/01/04')
    .then (data => {
      const grid = new Array(data.size.columns * data.size.rows);

      for (let i = 0; i < grid.length; i++) {
        grid[i] = {
          focus: false,
          semiFocus: false,
          type: data.gridSquares[i].type,
          clueNumbers: data.gridSquares[i].clueNumbers, 
          value: ''
        };
      }

      this.setFocusToClue(grid, 0, this.state.clueDirection);

      this.setState({
        gridValues: grid,
        puzzleData: data
      });
    })
    .catch (error => {

    });
  }

  setFocusToClue (grid, focusedElement, clueDirection) {
    let clueNumbers = grid[focusedElement].clueNumbers;
    grid[focusedElement].focus = true;

    for (let i = 0; i < grid.length; i++) {
      grid[i].semiFocus = false;
      if (!grid[i].focus) {
        if (clueDirection === CLUE_DIRECTION.Across) {
          if (clueNumbers.across === grid[i].clueNumbers.across) {
            grid[i].semiFocus = true;
          }
        } else {
          if (clueNumbers.down === grid[i].clueNumbers.down) {
            grid[i].semiFocus = true;
          }
        }
      }
    }
  }

  squareClickedHandler = (index) => {
    const grid = [...this.state.gridValues];
    let clueDirection = this.state.clueDirection;

    for (let i = 0; i < grid.length; i++) {
      if (i === index) {
        if (grid[i].focus) {
          clueDirection = (clueDirection === CLUE_DIRECTION.Across) ? CLUE_DIRECTION.Down : CLUE_DIRECTION.Across;
        }
      } else {
        grid[i] = {...grid[i], focus: false, semiFocus: false};
      }
    }

    this.setFocusToClue(grid, index, clueDirection);

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

      if (this.state.gridValues[nextElement].type !== SQUARE_TYPE.Black) {
        gotValidSquare = true;
      }
    }
    
    return nextElement;
  }

  keyPressedHandler = (button) => {
    const grid = [...this.state.gridValues];

    for (let i = 0; i < grid.length; i++) {
      if (grid[i].focus) {
        grid[i] = {...grid[i]};
        if (button === "{bksp}") {
          grid[i].value = '';
        } else {
          grid[i].value = button;
          grid[i].focus = false;
          const nextElement = this.getNextSquarePoints(i);
          this.setFocusToClue(grid, nextElement, this.state.clueDirection);
        }

        this.setState({gridValues: grid});
        return;
      }
    }
  }

  getClue = () => {
    let clueNumbers = {};
    for (let i = 0; i < this.state.gridValues.length; i++) {
      if (this.state.gridValues[i].focus) {
        clueNumbers = this.state.gridValues[i].clueNumbers;
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
              semiFocused={this.state.gridValues[i].semiFocus}
              value = {this.state.gridValues[i].value}
              type={this.state.gridValues[i].type} 
              clicked={() => this.squareClickedHandler(i)} />);
      }
    }

    let content = <Spinner />;

    if (squares) {
      content = <div className={classes.Content}>
        <div className={classes.Grid}>
          {squares}
        </div>
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

const mapStateToProps = state => {
  return {
    gridValues: state.crossword
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitCrossword: () => dispatch(initCrossword())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);