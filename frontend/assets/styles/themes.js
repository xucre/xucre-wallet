import { Dimensions, StyleSheet} from 'react-native';
import { createStyle, createTheme } from 'react-native-theming';

import IconBlack from '../images/icon-black.png';
import IconWhite from '../images/icon-white.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const themes = [
  createTheme({
    backgroundColor: 'white',
    buttonColor: 'blue',
    buttonText: 'white',
    headerBackground: 'white',
    icon: IconBlack,
    statusBar: 'dark-content',
    textColor: 'black',
  }, 'light'),
  createTheme({
    backgroundColor: 'black',
    buttonColor: 'yellow',
    buttonText: 'black',
    headerBackground: 'black',
    icon: IconWhite,
    statusBar: 'light-content',
    textColor: 'white',
  }, 'dark'),
];

const styles = createStyle({
  container: {
    alignItems: 'center',
    backgroundColor: '@backgroundColor',
    flex: 1,
    justifyContent: 'center',
  },
  landing_bottomText: {
    color: '@textColor',
    fontSize: (windowWidth/100)*50,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
  },
  landing_container: {
    backgroundColor: '@backgroundColor',
    color: '@textColor',
    flex: 1,
    justifyContent: 'flex-end',
  },
  landing_footerContainer: {
    alignItems: 'flex-start',
    color: '@textColor'
  },
  landing_footerText: {
    color: '@textColor',
    fontSize: (windowWidth/100)*4,
    textAlign: 'center',
  },
  landing_middleText: {
    color: '@textColor',
    fontSize:  (windowWidth/100)*4.1,
    paddingHorizontal: 10,
  },
  landing_textFamily: {
    flexDirection: 'row',
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
  },
  landing_topText: {
    color: '@textColor',
    fontSize: (windowWidth/10),
    paddingHorizontal: 10,
  }
});

export {styles, themes}