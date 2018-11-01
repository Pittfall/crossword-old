import * as actionTypes from '../actions/actionTypes';
import { CROSSWORD_DATA } from '../../constants/constants';

const initialState = {
   crossword: CROSSWORD_DATA
}

const reducer = (state = initialState, action) => {
   switch (action) {
      case actionTypes.INIT_CROSSWORD:
         return { ...state, crossword: CROSSWORD_DATA }
      case actionTypes.INIT_CROSSWORD_SUCCESS:
         return { ...state, crossword: action.crosswordData }
      case actionTypes.INIT_CROSSWORD_FAIL:
         return state;
      default:
         return state;
   }
}

export default reducer;