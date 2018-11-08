import { CLUE_DIRECTION, SQUARE_TYPE } from '../constants/constants';

export class CrosswordSquare {
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
       value: ''
     }
   }
 }
 
 export class CrosswordGrid {
   constructor (crosswordGrid) {
      if (crosswordGrid) {
         this.squares = crosswordGrid.squares.map(square => {
            return {
               ...square,
               clueNumbers: {
                  ...square.clueNumbers
               },
               userData: {
                  ...square.userData
               }
            }
         });
         this.clues = {
            ...crosswordGrid.clues,
            across: crosswordGrid.clues.across.map(clue => {
               return { ...clue }
            }),
            down: crosswordGrid.clues.down.map(clue => {
               return { ...clue }
            })
         };
         this.size = { ...crosswordGrid.size }
      } else {
         this.squares = new CrosswordSquare();
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

   setFocusToClue (mainFocusedElement, clueDirection) {
      let clueNumbers = this.squares[mainFocusedElement].clueNumbers;

      for (let i = 0; i < this.squares.length; i++) {
         this.squares[i].userData.focus = false;
         this.squares[i].userData.semiFocus = false;
         if (i !== mainFocusedElement) {
            if (clueDirection === CLUE_DIRECTION.Across) {
               if (clueNumbers.across === this.squares[i].clueNumbers.across) {
                  this.squares[i].userData.semiFocus = true;
            }
            } else {
               if (clueNumbers.down === this.squares[i].clueNumbers.down) {
                  this.squares[i].userData.semiFocus = true;
               }
            }
         }
      }

      this.squares[mainFocusedElement].userData.focus = true;
   }

   getClue (clueDirection) {
      let clueNumbers = {};
      for (let i = 0; i < this.squares.length; i++) {
        if (this.squares[i].userData.focus) {
          clueNumbers = this.squares[i].clueNumbers;
          break;
        }
      }
      let retClue = null;
  
      if (clueDirection === CLUE_DIRECTION.Across) {
        retClue = this.clues.across.find(key => {
          return +key.number === clueNumbers.across;
        });
      } else {
        retClue = this.clues.down.find(key => {
          return +key.number === clueNumbers.down;
        });
      }
  
      return retClue.clue;
    }

   getFocusedSquareIndex () {
      return this.squares.findIndex(square => square.userData.focus);
   }

   getPreviousClueNumber (currentClueNumber, clueDirection) {
      let clues = null;

      if (clueDirection === CLUE_DIRECTION.Across) {
         clues = this.clues.across.map(clue => {
            return +clue.number;
         });
      } else {
         clues = this.clues.down.map(clue => {
            return +clue.number;
         });
      }

      let indexOfPreviousClue = clues.indexOf(currentClueNumber) - 1;
      indexOfPreviousClue = indexOfPreviousClue < 0 ? 0 : indexOfPreviousClue;

      return clues[indexOfPreviousClue];
   }

   getNextClueNumber (currentClueNumber, clueDirection) {
      let clues = null;

      if (clueDirection === CLUE_DIRECTION.Across) {
         clues = this.clues.across.map(clue => {
            return +clue.number;
         });
      } else {
         clues = this.clues.down.map(clue => {
            return +clue.number;
         });
      }

      let indexOfNextClue = clues.indexOf(currentClueNumber) + 1;
      indexOfNextClue = indexOfNextClue >= clues.length ? 0 : indexOfNextClue;

      return clues[indexOfNextClue];
   }

   getNextSquare (clueDirection) {
      let gotValidSquare = false;
      const currentElement = this.getFocusedSquareIndex();
      let nextElement = currentElement;

      while(!gotValidSquare) {
         if (clueDirection === CLUE_DIRECTION.Across) {
            nextElement++;
  
            if (nextElement >= this.squares.length) {
               nextElement = 0;
            }
         }

         if (clueDirection === CLUE_DIRECTION.Down) {
            nextElement += this.size.columns;

            // if we are on the last square, go back to the beginning.
            if (nextElement === this.squares.length - 1) {
               nextElement = 0;
            }

            if (nextElement >= this.squares.length) {
               nextElement = (nextElement - this.squares.length) + 1;
            }
         }
  
         if (this.squares[nextElement].type !== SQUARE_TYPE.Black) {
            if (clueDirection === CLUE_DIRECTION.Across) {
               gotValidSquare = true;
            } else {
               const lastClueDown = this.squares[currentElement].clueNumbers.down;
               const currentClueDown = this.squares[nextElement].clueNumbers.down;
               const nextClueDown = this.getNextClueNumber(lastClueDown, CLUE_DIRECTION.Down);

               // Check if the next square is part of the current clue or part of the next clue number in sequence.
               if (currentClueDown === lastClueDown || currentClueDown === nextClueDown) {
                  gotValidSquare = true;
               }
            }
         }
      }
      
      return nextElement;
    }

    getPreviousSquare (clueDirection) {
      let gotValidSquare = false;
      const currentElement = this.getFocusedSquareIndex();
      let nextElement = currentElement;

      if (currentElement === 0) {
         return 0;
      }

      while(!gotValidSquare) {
         if (clueDirection === CLUE_DIRECTION.Across) {
            nextElement--;
            nextElement = nextElement < 0 ? 0 : nextElement;
         } else {
            nextElement -= this.size.columns;

            if (nextElement < 0) {
               nextElement = (this.squares.length + nextElement) - 1;
            }
         }

  
         if (this.squares[nextElement].type !== SQUARE_TYPE.Black) {
            if (clueDirection === CLUE_DIRECTION.Across) {
               gotValidSquare = true;
            } else {
               const lastClueDown = this.squares[currentElement].clueNumbers.down;
               const currentClueDown = this.squares[nextElement].clueNumbers.down;
               const nextClueDown = this.getPreviousClueNumber(lastClueDown, CLUE_DIRECTION.Down);

               // Check if the next square is part of the current clue or part of the next clue number in sequence.
               if (currentClueDown === lastClueDown || currentClueDown === nextClueDown) {
                  gotValidSquare = true;
               }
            }
         }
      }
      
      return nextElement;
    }
 }

