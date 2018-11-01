export class SquareData {
  constructor () {
    this.type = null;
    this.clueNumbers = {
      across: null,
      down: null,
    }
    this.answer = '';
    this.userData =  {
      focus: false,
      semiFocus: false,
      userValue: ''
    }
  }
}

export class CrosswordData {
  constructor () {
    this.gridSquares = new SquareData();
    this.clues = {
      across: {},
      down: {}
    }
    this.size = {
        rows: 0,
        columns: 0
    }
  }
}

export const CLUE_DIRECTION = Object.freeze({
  Across: 0,
  Down: 1
});

export const SQUARE_TYPE = Object.freeze({
  Black: 'B',
  Empty: 'E',
  Numbered: 'N'
});

export const CROSSWORD_SOURCE = Object.freeze({
  NYT: 0
});