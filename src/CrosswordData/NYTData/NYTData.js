import { GetMockPuzzle } from '../../Http/API/API';

export const mockPuzzle = () => {
  return new Promise((resolve, reject) => {
    GetMockPuzzle()
    .then(response => {
      console.log(response.data);
      let retData  = {
        clues: {
          across: {},
          down: {}
        },
        grid: {},
        size: {
          rows: response.data.size.rows,
          columns: response.data.size.cols
        }
      };
      
      retData.clues.across = response.data.clues.across.map((key, i) => {
        return {
          number: GetNumberFromClue(response.data.clues.across[i]),
          clue: response.data.clues.across[i],
          answer: response.data.answers.across[i]
        }
      });

      retData.clues.down = response.data.clues.down.map((key, i) => {
        return {
          number: GetNumberFromClue(response.data.clues.down[i]),
          clue: response.data.clues.down[i],
          answer: response.data.answers.down[i]
        }
      });

      let clueNumber = response.data.gridnums[0];

      retData.grid = response.data.gridnums.map((key, i) => {
        const values = {
          type: null,
          clueNumber: {
            across: null,
            down: null,
          },
          answer: null
        }

        if (response.data.gridnums[i] === 0) {
          if (response.data.grid[i] === '.') {
            values.type = 'B';
            if (i + 1 < response.data.gridnums.length) {
              clueNumber = response.data.gridnums[i + 1];
            }
          } else {
            values.type = 'W';
            values.clueNumber.across = clueNumber;
          }
        } else {
          values.type = response.data.gridnums[i];

          // If the current element we are on is divisible by the number of columns,
          // we are on the next row.
          if (i % response.data.size.cols === 0) {
            clueNumber = response.data.gridnums[i];
          }
          values.clueNumber.across = clueNumber;
        }

        return values;
      });

      clueNumber = response.data.gridnums[0];
      let elementNumber = 0;
      let finished = false;
      
      while (!finished) {
        if (retData.grid[elementNumber].type === 'B') {
          elementNumber += response.data.size.cols;
          if (elementNumber >= response.data.gridnums.length) {
            elementNumber = elementNumber - response.data.gridnums.length + 1;
          } 
          clueNumber = response.data.gridnums[elementNumber];
          continue;
        }

        retData.grid[elementNumber].clueNumber.down = clueNumber;

        elementNumber += response.data.size.cols;
        if (elementNumber >= response.data.gridnums.length) {
          elementNumber = elementNumber - response.data.gridnums.length + 1;
          clueNumber = response.data.gridnums[elementNumber];
        }

        // On the last element.
        if (elementNumber === response.data.gridnums.length - 1) {
          retData.grid[elementNumber].clueNumber.down = clueNumber;
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