import React from 'react';

import classes from './Square.module.css';

const square = (props) => {
  const squareType = props.type;
  let squareCSS = [classes.white];
  let clicked = props.clicked;

  if (isNaN(squareType)) {
    if (squareType === 'B') {
      squareCSS = [...squareCSS, classes.black];
      clicked = null;
    }
  }
  else {
    squareCSS = [...squareCSS, classes.numbered]
  }

  if (props.focused) {
    squareCSS = [...squareCSS, classes.focused];
  }

  return (
    <div className={squareCSS.join(' ')} onClick={clicked}>{props.value}</div>
  );
}

export default square;