import * as actionTypes from './actionTypes';
import { CROSSWORD_SOURCE } from '../../constants/constants';
import { NYTPuzzle } from '../../CrosswordData/NYTData/NYTData';
import { CLUE_DIRECTION } from '../../constants/constants';

export const initCrossword = () => {
   return dispatch => {
      dispatch(initCrosswordStart());
      getCrossword(CROSSWORD_SOURCE.NYT, '2017/01/04')
         .then (data => {
            const crosswordGrid = data;
            crosswordGrid.setFocusToClue(0, CLUE_DIRECTION.Across);
            dispatch(initCrosswordSuccess(crosswordGrid));
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

export const updateClueDirection = (clueDirection) => {
   return {
      type: actionTypes.UPDATE_CLUE_DIRECTION,
      clueDirection: clueDirection
   }
}