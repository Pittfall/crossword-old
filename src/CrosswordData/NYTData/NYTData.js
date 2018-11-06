import { GetNYTPuzzle } from '../../Http/API/API';
import { SQUARE_TYPE } from '../../constants/constants';
import { CrosswordGrid, CrosswordSquare } from '../../utilities/grid'

export const NYTPuzzle = (publishDate) => {
  return new Promise((resolve, reject) => {
    GetNYTPuzzle(publishDate)
    .then(response => {
      const NYT_SQUARE_TYPE = Object.freeze({
        UNNUMBERED: 0,
        BLACK: '.'
      });
      
      const puzzleData = response.data;
      console.log(puzzleData);
      let retData  = new CrosswordGrid();

      retData.size.columns = puzzleData.size.cols;
      retData.size.rows = puzzleData.size.rows;
      
      retData.clues.across = puzzleData.clues.across.map((key, i) => {
        return {
          number: GetNumberFromClue(puzzleData.clues.across[i]),
          clue: puzzleData.clues.across[i],
          answer: puzzleData.answers.across[i]
        }
      });

      retData.clues.down = puzzleData.clues.down.map((key, i) => {
        return {
          number: GetNumberFromClue(puzzleData.clues.down[i]),
          clue: puzzleData.clues.down[i],
          answer: puzzleData.answers.down[i]
        }
      });

      let clueNumber = puzzleData.gridnums[0];

      retData.squares = puzzleData.gridnums.map((key, i) => {
        const values = new CrosswordSquare();
        values.answer = puzzleData.grid[i]

        if (puzzleData.gridnums[i] === NYT_SQUARE_TYPE.UNNUMBERED) {
          if (puzzleData.grid[i] === NYT_SQUARE_TYPE.BLACK) {
            values.type = SQUARE_TYPE.Black;
            if (i + 1 < puzzleData.gridnums.length) {
              clueNumber = puzzleData.gridnums[i + 1];
            }
          } else {
            values.type = SQUARE_TYPE.Empty;
            values.clueNumbers.across = clueNumber;
          }
        } else {
          values.type = SQUARE_TYPE.Numbered;

          // If the current element we are on is divisible by the number of columns,
          // we are on the next row.
          if (i % puzzleData.size.cols === 0) {
            clueNumber = puzzleData.gridnums[i];
          }
          values.clueNumbers.across = clueNumber;
        }

        return values;
      });

      clueNumber = puzzleData.gridnums[0];
      let elementNumber = 0;
      let finished = false;
      
      while (!finished) {
        if (retData.squares[elementNumber].type === SQUARE_TYPE.Black) {
          elementNumber += puzzleData.size.cols;
          if (elementNumber >= puzzleData.gridnums.length) {
            elementNumber = elementNumber - puzzleData.gridnums.length + 1;
          } 
          clueNumber = puzzleData.gridnums[elementNumber];
          continue;
        }

        retData.squares[elementNumber].clueNumbers.down = clueNumber;

        elementNumber += puzzleData.size.cols;
        if (elementNumber >= puzzleData.gridnums.length) {
          elementNumber = elementNumber - puzzleData.gridnums.length + 1;
          clueNumber = puzzleData.gridnums[elementNumber];
        }

        // On the last element.
        if (elementNumber === puzzleData.gridnums.length - 1) {
          retData.squares[elementNumber].clueNumbers.down = clueNumber;
          finished = true;
        }
      }

      console.log(retData);

      resolve(retData);
    })
    .catch (error => {
      reject(error);
    });
  });
}

const GetNumberFromClue = (clue) => {
  return clue.substr(0, clue.indexOf('.')); 
}