import { createTheme, createStyle } from 'react-native-theming';
import { StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const themes = [
  createTheme({
    backgroundColor: 'white',
    buttonColor: 'blue',
    buttonText: 'white',
    headerBackground: 'white',
    icon: require('../images/icon-black.png'),
    statusBar: 'dark-content',
    textColor: 'black',
  }, 'light'),
  createTheme({
    backgroundColor: 'black',
    buttonColor: 'yellow',
    buttonText: 'black',
    headerBackground: 'black',
    icon: require('../images/icon-white.png'),
    statusBar: 'light-content',
    textColor: 'white',
  }, 'dark'),
];

const styles = createStyle({
  container: {
    flex: 1,
    backgroundColor: '@backgroundColor',
    alignItems: 'center',
    justifyContent: 'center',
  },
  landing_container: {
    flex: 1,
    backgroundColor: '@backgroundColor',
    justifyContent: 'flex-end',
    color: '@textColor'
  },
  landing_footerContainer: {
    alignItems: 'flex-start',
    color: '@textColor'
  },
  landing_textFamily: {
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    flexDirection: 'row'
  },
  landing_topText: {
    fontSize: (windowWidth/10),
    paddingHorizontal: 10,
    color: '@textColor'
  },
  landing_middleText: {
    fontSize:  (windowWidth/100)*4.1,
    paddingHorizontal: 10,
    color: '@textColor'
  },
  landing_bottomText: {
    fontSize: (windowWidth/100)*50,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    color: '@textColor'
  },
  landing_footerText: {
    fontSize: (windowWidth/100)*4,
    color: '@textColor',
    textAlign: 'center'
  }
});

export {styles, themes}