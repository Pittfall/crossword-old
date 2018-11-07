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

   getFocusedSquare () {
      return this.squares.findIndex(square => square.userData.focus);
   }

   getNextSquare (clueDirection) {
      let gotValidSquare = false;
      let nextElement = this.getFocusedSquare();
  
      while(!gotValidSquare) {
         if (clueDirection === CLUE_DIRECTION.Across) {
            nextElement++;
  
            if (nextElement >= this.squares.length) {
               nextElement = 0;
            }
         }
    
         if (clueDirection === CLUE_DIRECTION.Down) {
            nextElement += this.size.columns;
  
            if (nextElement >= this.squares.length) {
               nextElement = (nextElement - this.squares.length) + 1;
            }
         }
  
         if (this.squares[nextElement].type !== SQUARE_TYPE.Black) {
            gotValidSquare = true;
         }
      }
      
      return nextElement;
    }
 }

