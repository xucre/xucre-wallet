/* eslint-disable react-native/no-inline-styles */
//import env from '@env';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import {
  Box,
  Container,
  extendTheme,
  Hidden,
  HStack,
  Image,
  MoonIcon,
  NativeBaseProvider,
  Pressable,
  SunIcon,
  useColorMode,
  useColorModeValue,
} from "native-base";
import React, { useEffect, useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  atom,
  RecoilRoot,
} from 'recoil';
import { v4 as uuidv4 } from 'uuid';

//import Icon from 'react-native-vector-icons/FontAwesome';

//import MobileFooter from './components/Footer';
import Menu from './components/Menu';
import LandingPage from './pages/Landing';
import SplashPage from './pages/Splash';
import CreateNetwork from './pages/network/CreateNetwork';
import SelectNetwork from './pages/network/SelectNetwork';
import ViewNetwork from './pages/network/ViewNetwork';
import CreateWallet from './pages/wallet/CreateWallet';
import SelectWallet from './pages/wallet/SelectWallet';
import ViewWallet from './pages/wallet/ViewWallet';
import { navigationRef } from './service/RootNavigation';

const Stack = createNativeStackNavigator();

// Define the config
const config = {
  useSystemColorMode: true,
};

const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1b1e24',
  },
};

// extend the theme
export const theme = extendTheme({ config });

export default function App(): JSX.Element { 
  //const StackNavigator = createThemedComponent(Stack.Navigator);
  const [scheme, setScheme] = useState('dark');
  const [routeState, setRouteState] = useState('');
  
  return (
    //<DAppProvider config={finalConfig}>
    <RecoilRoot>
      <NativeBaseProvider theme={theme}>
        <SafeAreaProvider>
            <NavigationContainer 
              theme={scheme === 'dark' ? AppDarkTheme : AppLightTheme} 
              ref={navigationRef}
            >
                <Stack.Navigator initialRouteName="Home"
                  screenOptions={({navigation, route}) => ({        
                    headerLeft: () => (<HeaderComp navigation={navigation}/>),
                    headerRight: () => (<Menu navigation={navigation} route={route} setScheme={setScheme} storage={null} />),
                  })}
                  screenListeners={{
                    state: (e) => {
                      //console.log('state changed');
                      setRouteState(uuidv4());
                    },
                  }}
                >
                  <Stack.Screen name="Home" component={LandingPage} options={{ 
                    headerTitle : ""
                  }} ></Stack.Screen>
                  <Stack.Screen name="CreateWallet" component={CreateWallet} options={{ 
                    title: '', 
                  }} ></Stack.Screen>                  
                  <Stack.Screen name="SelectWallet" component={SelectWallet} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="ViewWallet" component={ViewWallet} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="CreateNetwork" component={CreateNetwork} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="SelectNetwork" component={SelectNetwork} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="ViewNetwork" component={ViewNetwork} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
      </NativeBaseProvider>
    </RecoilRoot>
    //</DAppProvider>
  )
}

export const ToggleDarkMode = ({setScheme}) => {
  const {
    colorMode,
    setColorMode
  } = useColorMode();

  useEffect(() => {
    setScheme(colorMode);
  }, [colorMode]);

  return (
    <Pressable onPress={() => colorMode === "light" ? setColorMode("dark") : setColorMode("light")}>
      {useColorModeValue(<MoonIcon size="6" />, <SunIcon size="6" />)}
    </Pressable>
  )
}


export function HeaderComp({navigation}) {
  const connector = useWalletConnect();
  const toLogin = () => {
    navigation.navigate('Home');
    //if (isComponentMounted) {
      /*if (connector.connected) {
        navigation.navigate('Channels', {artistId: null, type: 'all'})
      } else {
        navigation.navigate('Connect');
      }*/
    //} 
  }
  return (
    <Pressable onPressIn={() => {toLogin()}}>
      <Container paddingY={1} >
        <HStack>
          <Hidden colorMode="dark">
            <Box >
              <Image
                style={{ height: 35, width: 65 }}
                source={require('./assets/images/icon-black.png')}
                alt="XucreWallet"
              />
            </Box>
          </Hidden>

          <Hidden colorMode="light">
            <Box >
              <Image
                style={{ height: 35, width: 65 }}
                source={require('./assets/images/icon-white.png')}
                alt="XucreWallet"
              />
            </Box>
          </Hidden>
        </HStack>
      </Container>
    </Pressable>
  );
}