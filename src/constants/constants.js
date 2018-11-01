export const CROSSWORD_DATA = {
  clues: {
    across: {},
    down: {}
  },
  gridSquares: {},
  size: {
      rows: 0,
      columns: 0
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