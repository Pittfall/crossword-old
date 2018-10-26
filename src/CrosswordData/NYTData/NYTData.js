import { GetMockPuzzle } from '../../Http/API/API';

export const mockPuzzle = () => {
  return new Promise((resolve, reject) => {
    GetMockPuzzle()
    .then(response => {
      console.log(response.data);
      let retData  = {
        across: {},
        down: {},
        grid: {},
        gridNums: {},
        rows: 0,
        columns: 0
      };

      for (let i = 0; i < response.data.clues.across.length; ++i) {
        retData.rows = response.data.size.rows;
        retData.columns = response.data.size.cols;
        retData.across[i] = {
          number: GetNumberFromClue(response.data.clues.across[i]),
          clue: response.data.clues.across[i],
          answer: response.data.answers.across[i]
        }
        retData.down[i] = {
          number: GetNumberFromClue(response.data.clues.down[i]),
          clue: response.data.clues.down[i],
          answer: response.data.answers.down[i]
        }
        retData.grid = response.data.grid;
        retData.gridNums = response.data.gridnums.map((key, i) => {
          if (response.data.gridnums[i] === 0) {
            if (response.data.grid[i] === '.') {
              return 'B';
            } else {
              return 'W';
            }
          } else {
            return response.data.gridnums[i];
          }
        });
      }

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