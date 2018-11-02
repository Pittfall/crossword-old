import * as actionTypes from './actionTypes';
import { CROSSWORD_SOURCE } from '../../constants/constants';
import { NYTPuzzle } from '../../CrosswordData/NYTData/NYTData';

export const initCrossword = () => {
   return dispatch => {
      dispatch(initCrosswordStart());
      getCrossword(CROSSWORD_SOURCE.NYT, '2017/01/04')
         .then (data => {
            dispatch(initCrosswordSuccess(data));
         })
         .catch (error => {
            dispatch(initCrosswordError(error));
         })
   }
}

export const updateCrossword = (crossword) => {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_CROSSWORD_USER_DATA,
      crossword: crossword
    });
  }
}

const initCrosswordStart = () => {
   return {
       type: actionTypes.INIT_CROSSWORD
   }
}

const initCrosswordSuccess = (crosswordData) => {
   return {
      type: actionTypes.INIT_CROSSWORD_SUCCESS,
      crosswordData: crosswordData
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