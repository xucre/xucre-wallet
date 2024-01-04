import React from 'react';

import IconBlack from '../images/icon-black.png';
import IconWhite from '../images/icon-white.png';

export const themes = {
  
  dark: {
    backgroundColor: 'black',
    buttonColor: 'yellow',
    buttonText: 'black',
    headerBackground: 'black',
    icon: IconWhite,
    statusBar: 'light-content',
    textColor: 'white',
  },
  light: {
    backgroundColor: 'white',
    buttonColor: 'blue',
    buttonText: 'white',
    headerBackground: 'white',
    icon: IconBlack,
    statusBar: 'dark-content',
    textColor: 'black',
  },
};

export const ThemeContext = React.createContext(
  themes.light // default value
);

export const iconBackground = (mode) => {
  return mode === 'dark' ? 'muted.800' : 'muted.300'
}