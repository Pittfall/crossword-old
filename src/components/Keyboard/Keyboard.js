import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'simple-keyboard/build/css/index.css';

import './Keyboard.css';

const keyboard = (props) => {
  const layout={
    'default': [
      'Q W E R T Y U I O P',
      'A S D F G H J K L',
      'Z X C V B N M'
    ]
  }

  const buttonTheme = [
    {
      class: 'KeyMAN',
      buttons: "Q W E R T Y U I O P A S D F G H J K L Z X C V B N M"
    }
  ];

  return (
    <Keyboard 
      layout={layout} 
      theme={"hg-theme-default hg-layout-default myTheme"} 
      buttonTheme={buttonTheme}
      onKeyPress={props.keyPress} />
  );
}

export default keyboard;