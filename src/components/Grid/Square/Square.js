import React from 'react';

import { SQUARE_TYPE } from '../../../constants/constants';
import classes from './Square.module.css';

const square = (props) => {
  const squareType = props.type;
  let squareCSS = [classes.Square];
  let clicked = props.clicked;

  switch (squareType) {
    case SQUARE_TYPE.Black:
      squareCSS = [...squareCSS, classes.Black];
      clicked = null;
      break;
    case SQUARE_TYPE.Numbered:
      squareCSS = [...squareCSS, classes.Numbered];
      break;
    default:
      break;
  }

  if (props.semiFocused) {
    squareCSS = [...squareCSS, classes.SemiFocused];
  }

  if (props.focused) {
    squareCSS = [...squareCSS, classes.Focused];
  }

  if (props.cleared) {
   squareCSS = [...squareCSS, classes.Cleared];
  }

  return (
    <div className={squareCSS.join(' ')} onClick={clicked}>{props.value}</div>
  );
}

export default square;