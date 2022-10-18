
import { Image } from 'react-native';
import { createStyle, createTheme, createThemedComponent } from 'react-native-theming';

import logo from '../../assets/images/icon-black.png';
const styles = createStyle({
  image: {
    height: 50,
    width: 50
  }
});
function LogoTitle() {


  return (
    <Image
      style={styles.image}
      source={logo}
    />
  );
}
export default LogoTitle;