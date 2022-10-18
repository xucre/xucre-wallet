import React from 'react';
export const themes = {
  
  dark: {
    backgroundColor: 'black',
    buttonColor: 'yellow',
    buttonText: 'black',
    headerBackground: 'black',
    icon: require('../images/icon-white.png'),
    statusBar: 'light-content',
    textColor: 'white',
  },
  light: {
    backgroundColor: 'white',
    buttonColor: 'blue',
    buttonText: 'white',
    headerBackground: 'white',
    icon: require('../images/icon-black.png'),
    statusBar: 'dark-content',
    textColor: 'black',
  },
};

export const ThemeContext = React.createContext(
  themes.light // default value
);