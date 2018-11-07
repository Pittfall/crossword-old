import * as actionTypes from '../actions/actionTypes';
import { CLUE_DIRECTION } from '../../constants/constants';
import { CrosswordGrid } from '../../utilities/grid';

const initialState = {
   crosswordGrid: null,
   clueDirection: CLUE_DIRECTION.Across
}

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actionTypes.INIT_CROSSWORD:
         return { ...state, crosswordGrid: null }
      case actionTypes.INIT_CROSSWORD_SUCCESS:
         return { ...state, crosswordGrid: action.crosswordGrid }
      case actionTypes.INIT_CROSSWORD_FAIL:
         return state;
      case actionTypes.UPDATE_CROSSWORD:
         return { ...state, crosswordGrid: action.crosswordGrid }
      case actionTypes.UPDATE_CLUE_DIRECTION:
         return { ...state, clueDirection: action.clueDirection }
      case actionTypes.GET_SQUARE_VALUES:
            const grid = new CrosswordGrid(state.crosswordGrid);

            for (const key in action.squareValues) {
               const element = Object.keys(action.squareValues[key])[0];
               const value = action.squareValues[key][element];

               grid.squares[[element]].userData.value = value;
            }

            return { ...state, crosswordGrid: grid }
      default:
         return state;
   }
}

export default reducer;