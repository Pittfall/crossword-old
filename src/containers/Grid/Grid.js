import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

import Square from '../../components/Grid/Square/Square';
import Clue from '../../components/Grid/Clue/Clue';
import Keyboard from '../../components/Keyboard/Keyboard';
import Spinner from '../../UI/Spinner/Spinner';
import Button from '../../UI/Button/Button';
import { squareValues } from '../../firebase/firebase';

import { CLUE_DIRECTION } from '../../constants/constants';
import { initCrossword, updateCrossword, updateClueDirection, getSquareValues } from '../../store/actions/grid';

import classes from './Grid.module.css';
import { CrosswordGrid } from '../../utilities/grid';

class Grid extends Component {
  state = {
    puzzleData: null
  }

  componentDidMount () {
    this.props.onInitCrossword();
  }

  squareClickedHandler = (index) => {
    const grid = new CrosswordGrid(this.props.crosswordGrid);
    let clueDirection = this.props.clueDirection;

    if (grid.squares[index].userData.focus) {
      clueDirection = (clueDirection === CLUE_DIRECTION.Across) ? CLUE_DIRECTION.Down : CLUE_DIRECTION.Across;
      this.props.onUpdateClueDirection(clueDirection);
    }

    grid.setFocusToClue(index, clueDirection);
    this.props.onUpdateCrossword(grid);
  }

  keyPressedHandler = (button) => {
    let grid = new CrosswordGrid(this.props.crosswordGrid);

    for (let i = 0; i < grid.squares.length; i++) {
      if (grid.squares[i].userData.focus) {
         let nextElement = 0;

         // TODO: fix this harcode.
         if (button === "{bksp}") {
            grid.squares[i].userData.value = '';
            nextElement = grid.getPreviousSquare(this.props.clueDirection);
         } else {
            grid.squares[i].userData.value = button;
            nextElement = grid.getNextSquare(this.props.clueDirection);
         }

         grid.setFocusToClue(nextElement, this.props.clueDirection);
       
         squareValues.update({ [i]: grid.squares[i].userData.value });

         this.props.onUpdateCrossword(grid);
         return;
      }
    }
  }

   clearErrorsClickedHandler = () => {
      let grid = new CrosswordGrid(this.props.crosswordGrid);
      debugger;
      for (let i = 0; i < grid.squares.length; i++) {
         if (grid.squares[i].answer !== grid.squares[i].userData.value) {
            grid.squares[i].userData.value = '';
            squareValues.update({ [i]: grid.squares[i].userData.value });
            this.props.onUpdateCrossword(grid);
         }
      }
   }

  render () {
    let squares = null;

    if (this.props.crosswordGrid) {
      squares = [];
      for (let i = 0; i < this.props.crosswordGrid.squares.length; i++) {
          squares.push(
            <Square key={i}
              focused={this.props.crosswordGrid.squares[i].userData.focus}
              semiFocused={this.props.crosswordGrid.squares[i].userData.semiFocus}
              value = {this.props.crosswordGrid.squares[i].userData.value}
              type={this.props.crosswordGrid.squares[i].type} 
              clicked={() => this.squareClickedHandler(i)} />);
      }
    }

    let content = <Spinner />;

    if (squares) {
      content = <div className={classes.Content}>
         <Button btnType='Danger' clicked={this.clearErrorsClickedHandler}>Clear Errors</Button>
         <div className={classes.Grid}>
            {squares}
         </div>
         <Clue clue={this.props.crosswordGrid.getClue(this.props.clueDirection)} />
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
    crosswordGrid: state.crosswordGrid,
    clueDirection: state.clueDirection
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitCrossword: () => dispatch(initCrossword()),
    onUpdateCrossword: (crosswordGrid) => dispatch(updateCrossword(crosswordGrid)),
    onUpdateClueDirection: (clueDirection) => dispatch(updateClueDirection(clueDirection)),
    onGetSquareValues: () => dispatch(getSquareValues())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);