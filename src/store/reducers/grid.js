import * as actionTypes from '../actions/actionTypes';

const initialState = {
   crossword: null
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actionTypes.INIT_CROSSWORD:
         return { ...state, crossword: null }
      case actionTypes.INIT_CROSSWORD_SUCCESS:
         return { ...state, crossword: action.crossword }
      case actionTypes.INIT_CROSSWORD_FAIL:
         return state;
      case actionTypes.UPDATE_CROSSWORD:
        return { ...state, crossword: action.crossword }
      default:
         return state;
   }
}

export default reducer;