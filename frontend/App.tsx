/* eslint-disable react-native/no-inline-styles */
//import env from '@env';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import '@walletconnect/react-native-compat';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
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
import React, { useEffect, useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  atom,
  RecoilRoot,
  useRecoilState
} from 'recoil';
import { v4 as uuidv4 } from 'uuid';

//import Icon from 'react-native-vector-icons/FontAwesome';

//import MobileFooter from './components/Footer';n
import translations from "./assets/translations";
import Menu from './components/Menu';
import Notifications from './components/Notifications';
import Listener from './components/transaction/Listener';
import LandingPage from './pages/Landing';
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
import LegacyConnectionRequest from './pages/walletConnect/v1/ConnectionRequest';
import LegacyEthSign from './pages/walletConnect/v1/EthSign';
import LegacySendTransaction from './pages/walletConnect/v1/SendTransaction';
import LegacySignTransaction from './pages/walletConnect/v1/SignTransaction';
import LegacySignTypedData from './pages/walletConnect/v1/SignTypedData';
import ConnectionRequest from './pages/walletConnect/v2/ConnectionRequest';
import EthSign from './pages/walletConnect/v2/EthSign';
import SendTransaction from './pages/walletConnect/v2/SendTransaction';
import SignTransaction from './pages/walletConnect/v2/SignTransaction';
import SignTypedData from './pages/walletConnect/v2/SignTypedData';
import { navigationRef } from './service/RootNavigation';
import { language as stateLanguage } from "./service/state";
import {createSignClient} from './service/walletConnect';
import whatsapp from './service/whatsapp';
import { getTheme, storeTheme } from './store/setting';



const Stack = createNativeStackNavigator();

// Define the config
const config = {
  //useSystemColorMode: true,
};

const AppLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    primary: '#D4E815',
  },
};

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1b1e24',
    primary: '#D4E815',
  },
};

// extend the theme
export const theme = extendTheme({ 
  colors: {
    // Add new color
    primary: {
      100: '#EEFB6',
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
  }
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
  //
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
  });
  const [scheme, setScheme] = useState('');
  const [routeState, setRouteState] = useState('');  
  const [language, ] = useRecoilState(stateLanguage);
  
  useEffect(() => {
    const runAsync = async () => {
      try {
        await createSignClient();
        
      } catch (err) {
        console.log(err);
      }
    }
    
    runAsync();
  }, []);
  
  return (
    <SafeAreaProvider>
      <NavigationContainer 
        theme={scheme === 'dark' ? AppDarkTheme : AppLightTheme} 
        ref={navigationRef}
      >
          <Stack.Navigator initialRouteName="Home"
            screenOptions={({navigation, route}) => ({        
              headerLeft: () => {                
                //return route.name === 'Home' ? <></> : <Notifications />;
                return route.name === 'Home' ? <></> : <Menu navigation={navigation} route={route} setScheme={setScheme} storage={null} />;
              },
              headerRight: () => {
                return route.name === 'Home' ? <></> : <Notifications />;
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
              title: translations[language].SelectWallet.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="ViewWallet" component={ViewWallet} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].ViewWallet.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="CreateNetwork" component={CreateNetwork} options={{ 
              title: '', 
            }} ></Stack.Screen>
            <Stack.Screen name="SelectNetwork" component={SelectNetwork} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SelectNetwork.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="ViewNetwork" component={ViewNetwork} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].ViewNetwork.title,  
            }} ></Stack.Screen>
            <Stack.Screen name="AddToken" component={AddToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].AddToken.title, 
            }} ></Stack.Screen>                  
            <Stack.Screen name="QRWallet" component={QRWallet} options={{ 
              title: '', 
            }} ></Stack.Screen>      
            <Stack.Screen name="SendToken" component={SendToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SendToken.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SwapToken" component={SwapToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SwapToken.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="BuyToken" component={BuyToken} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SwapToken.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SupportPage" component={SupportPage} options={{ 
              headerTitleAlign: 'left',
              title: ' ', 
            }} ></Stack.Screen>
             <Stack.Screen name="whatsapp" component={whatsapp} options={{ 
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
            <Stack.Screen name="ConnectionRequest" component={ConnectionRequest} options={{ 
              title: '', 
            }} ></Stack.Screen>
            <Stack.Screen name="SignTyped" component={SignTypedData} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SignTyped.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SignEth" component={EthSign} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SignEth.title, 
            }} ></Stack.Screen>                  
            <Stack.Screen name="SignTransaction" component={SignTransaction} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SignTransaction.title, 
            }} ></Stack.Screen>           
            <Stack.Screen name="SendTransaction" component={SendTransaction} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].SendTransaction.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="LegacyConnectionRequest" component={LegacyConnectionRequest} options={{ 
              title: '', 
            }} ></Stack.Screen>
            <Stack.Screen name="LegacySignTypedData" component={LegacySignTypedData} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].LegacySignTypedData.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="LegacyEthSign" component={LegacyEthSign} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].LegacyEthSign.title, 
            }} ></Stack.Screen>                  
            <Stack.Screen name="LegacySignTransaction" component={LegacySignTransaction} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].LegacySignTransaction.title, 
            }} ></Stack.Screen>           
            <Stack.Screen name="LegacySendTransaction" component={LegacySendTransaction} options={{ 
              headerTitleAlign: 'left',
              title: translations[language].LegacySendTransaction.title, 
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

/**
 * <Stack.Screen name="NFTs" component={NftList} options={{ 
      headerTitleAlign: 'left',
      title: 'NFTs', 
    }} ></Stack.Screen>
 */