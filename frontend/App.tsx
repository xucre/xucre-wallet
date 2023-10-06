/* eslint-disable react-native/no-inline-styles */

// If you have react native < 0.70, you need to polyfill BigInt. Run `yarn add big-integer` and uncomment the line below
// eslint-disable-next-line functional/immutable-data
if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');

//import env from '@env';
import notifee, { EventType } from '@notifee/react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import '@walletconnect/react-native-compat';
import { useFonts } from 'expo-font';
import { run } from 'jest';
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
  Text,
  useColorMode,
  useColorModeValue,
} from "native-base";
import React, { useEffect, useRef, useState} from 'react';
import { AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  atom,
  RecoilRoot,
  useRecoilState
} from 'recoil';
import { v4 as uuidv4 } from 'uuid';

//import Icon from 'react-native-vector-icons/FontAwesome';

//import MobileFooter from './components/Footer';n
import { Color } from '../GlobalStyles';


import translations from "./assets/translations";
import Menu from './components/Menu';
import Notifications from './components/Notifications';
import SendNotificationToken from './components/SendNotificationToken';
import Listener from './components/transaction/Listener';
import CodeCountry from './components/utils/CodeCountry';
import Loader from './components/utils/Loader';
import { EIP155_SIGNING_METHODS } from './data/EIP1155Data';
import LandingPage from './pages/Landing';
import LanguagePage from './pages/Language';
import PrivacyPolicy from './pages/Policies';
import QRReader from './pages/QRReader';
import SetPassword from './pages/SetPassword';
import SupportPage from './pages/SupportPage';
import CreateNetwork from './pages/network/CreateNetwork';
import SelectNetwork from './pages/network/SelectNetwork';
import ViewNetwork from './pages/network/ViewNetwork';
import NftList from './pages/nft/NftList';
import AddToken from './pages/token/AddToken';
import BuyToken from './pages/token/BuyToken';
import SendToken from './pages/token/SendToken';
import SwapToken from './pages/token/SwapToken';
import CreateWallet from './pages/wallet/CreateWallet';
import NewWallet from './pages/wallet/NewWallet';
import QRWallet from './pages/wallet/QRWallet';
import RecoverWallet from './pages/wallet/RecoverWallet';
import SelectWallet from './pages/wallet/SelectWallet';
import ViewWallet from './pages/wallet/ViewWallet';
import WalletHistory from './pages/wallet/WalletHistory';
import ConnectionRequest from './pages/walletConnect/v2/ConnectionRequest';
import Connections from './pages/walletConnect/v2/Connections';
import EthSign from './pages/walletConnect/v2/EthSign';
import Requests from './pages/walletConnect/v2/Requests';
import SendTransaction from './pages/walletConnect/v2/SendTransaction';
import SignTransaction from './pages/walletConnect/v2/SignTransaction';
import SignTypedData from './pages/walletConnect/v2/SignTypedData';
import { navigate, navigationRef } from './service/RootNavigation';
import { language as stateLanguage } from "./service/state";
import {createSignClient, signClient} from './service/walletConnect';
import whatsapp from './service/whatsapp';
import { getNotification, getTheme, storeTheme } from './store/setting';



const Stack = createNativeStackNavigator();

// Define the config
const config = {
  //useSystemColorMode: true,
};

const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Color.white,
    card: Color.white,
    primary: '#1B1E3F',
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Color.black,
    card: Color.black,
    primary: '#D4E815',
  },
};

// extend the theme
export const theme = extendTheme({ 
  colors: {
    // Add new color
    primary: {
      100: '#EEFB65',
      200: '#E1F245',
      300: '#E1F245',
      400: '#D4E815',
      50: '#EEFB6',
      500: '#D4E815',
      600: '#A6B708',
      700: '#A6B708',
      800: '#829000',
      900: '#829000',
    },
    tertiary: {
      100: '#1B1E3F',
      200: '#1B1E3F',
      300: '#1B1E3F',
      400: '#1B1E3F',
      50: '#1B1E3F',
      500: '#1B1E3F',
      600: '#1B1E3F',
      700: '#1B1E3F',
      800: '#1B1E3F',
      900: '#1B1E3F',
    },
  },
 });

export default function App(): JSX.Element { 
  //const StackNavigator = createThemedComponent(Stack.Navigator);
  

  return (
    //<DAppProvider config={finalConfig}>
    <RecoilRoot>
      <NativeBaseProvider theme={theme}>
        <AppWrapper />
      </NativeBaseProvider>
    </RecoilRoot>
    //</DAppProvider>
  )
}

export const AppWrapper = () => {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
  });
  const [scheme, setScheme] = useState('');
  const [routeState, setRouteState] = useState('');  
  const [language, ] = useRecoilState(stateLanguage);
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {

    //console.log('notification foreground:', detail);
      switch (type) {
        case EventType.DISMISSED:
          //console.log('User dismissed notification', detail);
          break;
        case EventType.PRESS:
          //console.log('User pressed notification', detail);
          break;
      }
    });
  }, []);
  const {
    colorMode,
    setColorMode
  } = useColorMode();  
  useEffect(() => {
    const runAsync = async () => {
      try {
        await createSignClient();
        //console.log('sign in created')
      } catch (err) {
        console.log('error creating sign client', err);
      }
    }
    
    runAsync();
  }, []);

  useEffect(() => {
    //console.log('scheme',scheme);
    if (scheme) {
      setColorMode(scheme);
    }
  }, [scheme])

  useEffect(() => {
    const runAsync = async () => {
      const clientTheme = await getTheme();
      if (!clientTheme) {
        //console.log('setting default theme');
        await storeTheme('light');
        setColorMode(clientTheme);
        setScheme('light');
      } else {
        //console.log('setting existing theme:', clientTheme);
        setColorMode(clientTheme);
        setScheme(clientTheme);
      }
    }
    
    runAsync();
  }, []);

  const hideHeader = (name) => {
    if (
      name === 'Home' || 
      name === 'Language' || 
      name === 'ConnectionRequest' || 
      name === 'SignTransaction' || 
      name === 'SendTransaction' || 
      name === 'SignEth' || 
      name === 'SignTyped' || 
      name === 'PrivacyPolicy'
    ) {
      return true;
    }
    return false;
  }
  
  return (
    <SafeAreaProvider>
      <Loader />
      <NavigationContainer 
        theme={scheme === 'dark' ? AppDarkTheme : AppLightTheme} 
        ref={navigationRef}
      >
          <Stack.Navigator initialRouteName="Home"
            screenOptions={({navigation, route}) => ({        
              headerLeft: () => {                
                //return route.name === 'Home' ? <></> : <Notifications />;
                return hideHeader(route.name) ? <></> : <Menu navigation={navigation} route={route} setScheme={setScheme} storage={null} />;
              },
              headerRight: () => {
                return hideHeader(route.name) ? <></> : <Notifications />;
                //return route.name === 'Home' ? <></> : <HeaderComp navigation={navigation}/>;
              },
            })}
            screenListeners={{
              state: (e) => {
                //console.log('state changed');
                setRouteState(uuidv4());
              },
            }}
          >
            <Stack.Screen name="Home" component={LandingPage} options={{ 
              headerShown: false,
              headerTitle : "",
            }} ></Stack.Screen>
            <Stack.Screen name="Language" component={LanguagePage} options={{ 
              headerShown: false,
              headerTitle : "",
            }} ></Stack.Screen>
            
            <Stack.Screen name="NewWallet" component={NewWallet} options={{ 
              title: '', 
            }} ></Stack.Screen> 
            <Stack.Screen name="CreateWallet" component={CreateWallet} options={{ 
              title: '', 
            }} ></Stack.Screen> 
            <Stack.Screen name="RecoverWallet" component={RecoverWallet} options={{ 
              title: '', 
            }} ></Stack.Screen>                  
            <Stack.Screen name="SelectWallet" component={SelectWallet} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.SelectWallet?.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="ViewWallet" component={ViewWallet} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.ViewWallet?.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="WalletHistory" component={WalletHistory} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.WalletHistory?.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="CreateNetwork" component={CreateNetwork} options={{ 
              title: '', 
            }} ></Stack.Screen>
            <Stack.Screen name="SelectNetwork" component={SelectNetwork} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.SelectNetwork?.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="ViewNetwork" component={ViewNetwork} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.ViewNetwork?.title,  
            }} ></Stack.Screen>
            <Stack.Screen name="AddToken" component={AddToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.AddToken?.title, 
            }} ></Stack.Screen>                  
            <Stack.Screen name="QRWallet" component={QRWallet} options={{ 
              title: '', 
            }} ></Stack.Screen>      
            <Stack.Screen name="SendToken" component={SendToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.SendToken?.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SwapToken" component={SwapToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language]?.SwapToken?.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="BuyToken" component={BuyToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SwapToken.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SupportPage" component={SupportPage} options={{ 
              headerTitleAlign: 'left',
              title: ' ', 
            }} ></Stack.Screen>
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ 
              headerTitleAlign: 'left',
              title: ' ', 
            }} ></Stack.Screen>
            <Stack.Screen name="CodeCountry" component={CodeCountry} options={{ 
              headerTitleAlign: 'left',
              title: ' ', 
            }} ></Stack.Screen>
            <Stack.Screen name="SendNotificationToken" component={SendNotificationToken} options={{ 
              headerTitleAlign: 'left',
              title: ' ', 
            }} ></Stack.Screen>
            <Stack.Screen name="NFT" component={NftList} options={{
              headerTitleAlign: 'left',
              title: translations[language].SwapToken.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="QRReader" component={QRReader} options={{ 
              title: '', 
            }} ></Stack.Screen>            
            <Stack.Screen name="Connections" component={Connections} options={{ 
              headerTitleAlign: 'left',
              title: 'Connections', 
            }} ></Stack.Screen>       
            <Stack.Screen name="Requests" component={Requests} options={{ 
              headerTitleAlign: 'left',
              title: 'Requests', 
            }} ></Stack.Screen>            
            <Stack.Screen name="ConnectionRequest" component={ConnectionRequest} options={{ 
              title: '', 
            }} ></Stack.Screen>
            <Stack.Screen name="SignTyped" component={SignTypedData} options={{ 
              headerTitleAlign: 'left',
              title: ' '//translations[language].SignTyped.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SignEth" component={EthSign} options={{ 
              headerTitleAlign: 'left',
              title: ' '//translations[language].SignEth.title, 
            }} ></Stack.Screen>                  
            <Stack.Screen name="SignTransaction" component={SignTransaction} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SignTransaction.header, 
            }} ></Stack.Screen>           
            <Stack.Screen name="SendTransaction" component={SendTransaction} options={{ 
              headerTitleAlign: 'left',
              title: ' '//translations[language].SendTransaction.title, 
            }} ></Stack.Screen>    
            <Stack.Screen name="SetPassword" component={SetPassword} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SetPassword.title, 
            }} ></Stack.Screen>
          </Stack.Navigator>
      </NavigationContainer>
      <Listener />
    </SafeAreaProvider>
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

/**
 * <Stack.Screen name="NFTs" component={NftList} options={{ 
      headerTitleAlign: 'left',
      title: 'NFTs', 
    }} ></Stack.Screen>
 */