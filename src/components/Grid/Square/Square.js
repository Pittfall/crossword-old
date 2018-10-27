import React from 'react';

import classes from './Square.module.css';

const square = (props) => {
  const squareType = props.type;
  let squareCSS = [classes.Square];
  let clicked = props.clicked;

  if (isNaN(squareType)) {
    if (squareType === 'B') {
      squareCSS = [...squareCSS, classes.Black];
      clicked = null;
    }
  }
  else {
    squareCSS = [...squareCSS, classes.Numbered]
  }

  if (props.semiFocused) {
    squareCSS = [...squareCSS, classes.SemiFocused];
  }

  if (props.focused) {
    squareCSS = [...squareCSS, classes.Focused];
  }

  return (
    <div className={squareCSS.join(' ')} onClick={clicked}>{props.value}</div>
  );
}

export default square;