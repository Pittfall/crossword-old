import { GetMockPuzzle } from '../../Http/API/API';
import { SQUARE_TYPE } from '../../constants/constants';

export const mockPuzzle = () => {
  return new Promise((resolve, reject) => {
    GetMockPuzzle()
    .then(response => {
      const puzzleData = response.data;
      //console.log(puzzleData);
      let retData  = {
        clues: {
          across: {},
          down: {}
        },
        grid: {},
        size: {
          rows: puzzleData.size.rows,
          columns: puzzleData.size.cols
        }
      };
      
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

      retData.grid = puzzleData.gridnums.map((key, i) => {
        const values = {
          type: null,
          clueNumbers: {
            across: null,
            down: null,
          },
          answer: puzzleData.grid[i]
        }

        if (puzzleData.gridnums[i] === 0) {
          if (puzzleData.grid[i] === '.') {
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
        if (retData.grid[elementNumber].type === SQUARE_TYPE.Black) {
          elementNumber += puzzleData.size.cols;
          if (elementNumber >= puzzleData.gridnums.length) {
            elementNumber = elementNumber - puzzleData.gridnums.length + 1;
          } 
          clueNumber = puzzleData.gridnums[elementNumber];
          continue;
        }

        retData.grid[elementNumber].clueNumbers.down = clueNumber;

        elementNumber += puzzleData.size.cols;
        if (elementNumber >= puzzleData.gridnums.length) {
          elementNumber = elementNumber - puzzleData.gridnums.length + 1;
          clueNumber = puzzleData.gridnums[elementNumber];
        }

        // On the last element.
        if (elementNumber === puzzleData.gridnums.length - 1) {
          retData.grid[elementNumber].clueNumbers.down = clueNumber;
          finished = true;
        }
      }

      //console.log(retData);

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