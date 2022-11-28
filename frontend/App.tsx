/* eslint-disable react-native/no-inline-styles */
//import env from '@env';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import '@walletconnect/react-native-compat';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
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
import Listener from './components/transaction/Listener';
import LandingPage from './pages/Landing';
import CreateNetwork from './pages/network/CreateNetwork';
import SelectNetwork from './pages/network/SelectNetwork';
import ViewNetwork from './pages/network/ViewNetwork';
import NftList from './pages/nft/NftList';
import AddToken from './pages/token/AddToken';
import SendToken from './pages/token/SendToken';
import SwapToken from './pages/token/SwapToken';
import CreateWallet from './pages/wallet/CreateWallet';
import NewWallet from './pages/wallet/NewWallet';
import QRWallet from './pages/wallet/QRWallet';
import RecoverWallet from './pages/wallet/RecoverWallet';
import SelectWallet from './pages/wallet/SelectWallet';
import ViewWallet from './pages/wallet/ViewWallet';
import ConnectionRequest from './pages/walletConnect/ConnectionRequest';
import EthSign from './pages/walletConnect/EthSign';
import QRReader from './pages/walletConnect/QRReader';
import SendTransaction from './pages/walletConnect/SendTransaction';
import SignTransaction from './pages/walletConnect/SignTransaction';
import SignTypedData from './pages/walletConnect/SignTypedData';
import { navigationRef } from './service/RootNavigation';
import {createSignClient} from './service/walletConnect';
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
  const [scheme, setScheme] = useState('');
  const [routeState, setRouteState] = useState('');  
  
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
                    headerTitleAlign: 'center',
                    title: 'Wallets', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="ViewWallet" component={ViewWallet} options={{ 
                    headerTitleAlign: 'center',
                    title: 'Wallet', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="CreateNetwork" component={CreateNetwork} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="SelectNetwork" component={SelectNetwork} options={{ 
                    headerTitleAlign: 'center',
                    title: 'Networks', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="ViewNetwork" component={ViewNetwork} options={{ 
                    headerTitleAlign: 'center',
                    title: 'Network',  
                  }} ></Stack.Screen>
                  <Stack.Screen name="AddToken" component={AddToken} options={{ 
                    headerTitleAlign: 'center',
                    title: 'Wallet', 
                  }} ></Stack.Screen>                  
                  <Stack.Screen name="QRWallet" component={QRWallet} options={{ 
                    title: '', 
                  }} ></Stack.Screen>      
                  <Stack.Screen name="SendToken" component={SendToken} options={{ 
                    headerTitleAlign: 'center',
                    title: 'Wallet', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="SwapToken" component={SwapToken} options={{ 
                    headerTitleAlign: 'center',
                    title: 'Wallet', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="QRReader" component={QRReader} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="ConnectionRequest" component={ConnectionRequest} options={{ 
                    title: '', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="SignTyped" component={SignTypedData} options={{ 
                    title: 'Sign Message', 
                  }} ></Stack.Screen>
                  <Stack.Screen name="SignEth" component={EthSign} options={{ 
                    title: 'Sign Message', 
                  }} ></Stack.Screen>                  
                  <Stack.Screen name="SignTransaction" component={SignTransaction} options={{ 
                    title: 'Sign Transaction', 
                  }} ></Stack.Screen>           
                  <Stack.Screen name="SendTransaction" component={SendTransaction} options={{ 
                    title: 'Send Transaction', 
                  }} ></Stack.Screen>
                  
                </Stack.Navigator>
            </NavigationContainer>
            <Listener />
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

/**
 * <Stack.Screen name="NFTs" component={NftList} options={{ 
      headerTitleAlign: 'center',
      title: 'NFTs', 
    }} ></Stack.Screen>
 */