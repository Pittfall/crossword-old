import React from 'react';
import classes from './Clue.module.css';

const clue = (props) => {
  return (
    <div className={classes.Clue}>
      <p>{props.clue}</p>
    </div>
  );
}

export default clue;