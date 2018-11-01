import * as actionTypes from '../actions/actionTypes';
import { CrosswordData } from '../../constants/constants';

const initialState = {
   crossword: new CrosswordData()
}

const reducer = (state = initialState, action) => {
   switch (action) {
      case actionTypes.INIT_CROSSWORD:
         return { ...state, crossword: new CrosswordData() }
      case actionTypes.INIT_CROSSWORD_SUCCESS:
         return { ...state, crossword: action.crosswordData }
      case actionTypes.INIT_CROSSWORD_FAIL:
         return state;
      default:
         return state;
   }
}

export default reducer;