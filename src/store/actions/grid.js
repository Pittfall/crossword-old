import * as actionTypes from './actionTypes';
import { CROSSWORD_SOURCE } from '../../constants/constants';
import { NYTPuzzle } from '../../CrosswordData/NYTData/NYTData';
import { CLUE_DIRECTION } from '../../constants/constants';
import { squareValues } from '../../firebase/firebase';

export const getSquareValues = () => {
   return dispatch => {
      squareValues.on('value', snapshot => {
         const squares = snapshot.val();

         if (squares) {
            dispatch(UpdateSquareValues(snapshot.val()));
         } else {
            // Initialize values (a 15x15 crossword will be of size 225 for example)
            squareValues.push().set({1: 'Q'});
         }
      });
   }
}

export const initCrossword = () => {
   return dispatch => {
      dispatch(initCrosswordStart());
      getCrossword(CROSSWORD_SOURCE.NYT, '2017/01/04')
         .then (data => {
            const crosswordGrid = data;
            crosswordGrid.setFocusToClue(0, CLUE_DIRECTION.Across);
            dispatch(initCrosswordSuccess(crosswordGrid));
            dispatch(getSquareValues());
         })
         .catch (error => {
            dispatch(initCrosswordError(error));
         })
   }
}

export const updateCrossword = (crosswordGrid) => {
   return dispatch => {
      dispatch({
         type: actionTypes.UPDATE_CROSSWORD,
         crosswordGrid: crosswordGrid
      });
   }
}

export const updateClueDirection = (clueDirection) => {
   return {
      type: actionTypes.UPDATE_CLUE_DIRECTION,
      clueDirection: clueDirection
   }
}

const UpdateSquareValues = (squareValues) => {
   return {
      type: actionTypes.GET_SQUARE_VALUES,
      squareValues: squareValues
   }
}

const initCrosswordStart = () => {
   return {
      type: actionTypes.INIT_CROSSWORD
   }
}

const initCrosswordSuccess = (crosswordGrid) => {
   return {
      type: actionTypes.INIT_CROSSWORD_SUCCESS,
      crosswordGrid: crosswordGrid
   }
}

const initCrosswordError = (error) => {
   return {
      type: actionTypes.INIT_CROSSWORD_SUCCESS,
      error: error
   }
}

const getCrossword = (source, publishDate) => {
   switch (source) {
      case CROSSWORD_SOURCE.NYT:
         return NYTPuzzle(publishDate);
      default:
         return NYTPuzzle(publishDate);
   }
}