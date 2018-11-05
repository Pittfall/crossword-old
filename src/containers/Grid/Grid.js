import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

import Square from '../../components/Grid/Square/Square';
import Clue from '../../components/Grid/Clue/Clue';
import Keyboard from '../../components/Keyboard/Keyboard';
import Spinner from '../../UI/Spinner/Spinner';

import { CLUE_DIRECTION, SQUARE_TYPE } from '../../constants/constants';
import { initCrossword, updateCrossword } from '../../store/actions/grid';

import classes from './Grid.module.css';

class Grid extends Component {
  state = {
    gridValues: null,
    clueDirection: CLUE_DIRECTION.Across,
    puzzleData: null
  }

  componentDidMount () {
    this.props.onInitCrossword();
  }

  componentWillMount () {
    debugger;
    if (this.props.gridSquares) {
      const grid = this.gridDeepCopy();
      this.setFocusToClue(grid, 0, this.state.clueDirection);
      this.props.onUpdateCrossword(grid);
    }
  }

  gridDeepCopy = () => {
    return {
      ...this.props.gridValues,
      clueNumbers: {
        ...this.props.gridValues.clueNumbers
      },
      gridSquares: {
        ...this.props.gridValues.gridSquares
      }
    }
  }

  setFocusToClue (grid, focusedElement, clueDirection) {
    let clueNumbers = grid.gridSquares[focusedElement].clueNumbers;
    grid.gridSquares[focusedElement].userData.focus = true;

    for (let i = 0; i < grid.gridSquares.length; i++) {
      grid.gridSquares[i].userData.semiFocus = false;
      if (!grid.gridSquares[i].userData.focus) {
        if (clueDirection === CLUE_DIRECTION.Across) {
          if (clueNumbers.across === grid.gridSquares[i].clueNumbers.across) {
            grid.gridSquares[i].userData.semiFocus = true;
          }
        } else {
          if (clueNumbers.down === grid.gridSquares[i].clueNumbers.down) {
            grid.gridSquares[i].userData.semiFocus = true;
          }
        }
      }
    }
  }

  squareClickedHandler = (index) => {
    const grid = this.gridDeepCopy();
    let clueDirection = this.state.clueDirection;

    for (let i = 0; i < grid.userData[i]; i++) {
      if (i === index) {
        if (grid.userData[i].focus) {
          clueDirection = (clueDirection === CLUE_DIRECTION.Across) ? CLUE_DIRECTION.Down : CLUE_DIRECTION.Across;
        }
      } else {
        grid.userData[i] = {...grid.userData[i], focus: false, semiFocus: false};
      }
    }

    this.setFocusToClue(grid, index, clueDirection);
    this.props.onUpdateCrossword(grid);
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
    for (let i = 0; i < this.props.gridValues.gridSquares.length; i++) {
      if (this.props.gridValues.gridSquares[i].userData.focus) {
        clueNumbers = this.props.gridValues.gridSquares[i].clueNumbers;
        break;
      }
    }
    let retClue = null;

    if (this.state.clueDirection === CLUE_DIRECTION.Across) {
      retClue = this.props.gridValues.clues.across.find(key => {
        return +key.number === clueNumbers.across;
      });
    } else {
      retClue = this.props.gridValues.clues.down.find(key => {
        return +key.number === clueNumbers.down;
      });
    }

    return retClue.clue;
  }

  render () {
    let squares = null;

    if (this.props.gridValues) {
      squares = [];
      for (let i = 0; i < this.props.gridValues.gridSquares.length; i++) {
          squares.push(
            <Square key={i}
              focused={this.props.gridValues.gridSquares[i].userData.focus}
              semiFocused={this.props.gridValues.gridSquares[i].userData.semiFocus}
              value = {this.props.gridValues.gridSquares[i].userData.userValue}
              type={this.props.gridValues.gridSquares[i].type} 
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
    onInitCrossword: () => dispatch(initCrossword()),
    onUpdateCrossword: (grid) => dispatch(updateCrossword(grid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);