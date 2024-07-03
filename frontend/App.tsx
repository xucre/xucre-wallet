/* eslint-disable react-native/no-inline-styles */

// If you have react native < 0.70, you need to polyfill BigInt. Run `yarn add big-integer` and uncomment the line below
// eslint-disable-next-line functional/immutable-data
if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');

//import env from '@env';
import notifee, { EventType } from '@notifee/react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import parseUrl from 'parse-url'
import 'react-native-gesture-handler';
import '@walletconnect/react-native-compat';
import { useFonts } from 'expo-font';
import {
  Avatar,
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
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  atom,
  RecoilRoot,
  useRecoilState
} from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { LensProvider, Theme } from '@lens-protocol/react-native-lens-ui-kit';
import { LinearGradient } from 'expo-linear-gradient';

//import Icon from 'react-native-vector-icons/FontAwesome';

//import MobileFooter from './components/Footer';n
import { Color } from '../GlobalStyles';


import translations from "./assets/translations";
import Menu from './components/ui/Menu';
import Notifications from './components/settings/Notifications';
import SendNotificationToken from './components/settings/SendNotificationToken';
//import Listener from './components/transaction/Listener';
import CodeCountry from './components/utils/CodeCountry';
import Loader from './components/utils/Loader';
import { EIP155_SIGNING_METHODS } from './data/EIP1155Data';
import LandingPage from './pages/Landing';
import LanguagePage from './pages/Language';
import PrivacyPolicy from './pages/Policies';
import QRReader from './pages/QRReader';
//import SetPassword from './pages/SetPassword';
import SupportPage from './pages/SupportPage';
import CreateNetwork from './pages/network/CreateNetwork';
import NetworkDefault from './pages/network/NetworkDefault';
import SelectNetwork from './pages/network/SelectNetwork';
import ViewNetwork from './pages/network/ViewNetwork';
import NftDashboard from './pages/nft/NftDashboard';
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
import ProfileList from './pages/social/ProfileList';
import { navigate, navigationRef } from './service/RootNavigation';
import { language as stateLanguage } from "./service/state";
import { createSignClient, signClient, mixpanel } from './service/walletConnect';
import whatsapp from './service/whatsapp';
import { getNotification, getTheme, storeTheme } from './store/setting';

import * as Linking from 'expo-linking';
import Loading from './pages/Loading';
import Profile from './pages/social/Profile';
import ConnectionManagement from './pages/walletConnect/ConnectionManagement';
import ExportWallet from './pages/wallet/ExportWallet';
import RampWidget from './pages/extensions/ramp/RampWidget';
import SelectExtension from './pages/extensions/SelectExtension';
import Ubeswap from './pages/extensions/ubeswap/Ubeswap';
import EthicHub from './pages/extensions/ethichub/EthicHub';
import ViewToken from './pages/token/ViewToken';
//import TransactionFeed from './pages/wallet/TransactionFeed';
//Import Mixpanel API
import { MixpanelProvider, useMixpanel } from './hooks/useMixpanel';
import UnlimitWidget from './pages/extensions/unlimit/UnlimitWidget';

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

  const config = {
    dependencies: {
      'linear-gradient': LinearGradient
    }
  };

  return (
    //<DAppProvider config={finalConfig}>
    <RecoilRoot>
      <NativeBaseProvider theme={theme} config={config}>
        <MixpanelProvider>
          <Suspense fallback={<Text>Loading...</Text>}>
            <AppWrapper />
          </Suspense>
        </MixpanelProvider>
      </NativeBaseProvider>
    </RecoilRoot>
    //</DAppProvider>
  )
}

export const AppWrapper = () => {
  const mixpanel = useMixpanel();
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
  });
  const [scheme, setScheme] = useState('');
  const [routeState, setRouteState] = useState('');
  const [language,] = useRecoilState(stateLanguage);
  const [linking, setLinking] = useState({ prefixes: [''] });
  const { colorMode, setColorMode } = useColorMode();
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      //('notifee foregrounde event', type);
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          break;
      }
    });
  }, []);
  useEffect(() => {
    const runAsync = async () => {
      try {
        //('isdev', __DEV__)
        if (!signClient) {
          await createSignClient(mixpanel);
        }

      } catch (err) {
        console.log('error creating sign client', err);
      }
    }
    runAsync();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (scheme && isMounted) {
      setColorMode(scheme);
    }
    return () => {
      isMounted = false;
    }
  }, [scheme])

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const clientTheme = await getTheme();
      if (!clientTheme) {
        await storeTheme('light');
        if (isMounted) setColorMode(clientTheme);
        if (isMounted) setScheme('light');
      } else {
        if (isMounted) setColorMode(clientTheme);
        if (isMounted) setScheme(clientTheme);
      }
    }

    runAsync();
    //Linking.resolveScheme({ scheme: 'com.xucre.expo.client' })
    const prefix = Linking.createURL('/');
    //const wcprefix = Linking.createURL('/', { scheme: 'wc' });


    setLinking({
      prefixes: [prefix, 'wc'],
    });

    Linking.addEventListener('url', async (req) => {
      // if (mixpanel) {
      //   mixpanel.track('Deep Link Triggered', {
      //     req
      //   });
      // }
      const parsedUrl = parseUrl(req.url);
      if (parsedUrl.resource === 'ViewWallet') {
        navigate('SelectWallet', {});
      } else {
        try {
          if (signClient) {
            if (parsedUrl.query.requestId) {
              //  do nothing
            } else if (parsedUrl.query.uri) {
              await signClient.pair({ uri: parsedUrl.query.uri })
            } else if (parsedUrl.protocol === 'wc') {
              await signClient.pair({ uri: req.url })
            }

          }
        } catch (e) {
          //console.log(e);
          throw e;
        }
      }

    })

    return () => {
      isMounted = false;
    }
  }, []);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      if (mixpanel.track) {
        mixpanel.track('Initial Url', {
          initialUrl
        });
      }
    };

    if (mixpanel) {
      getUrlAsync();
    }
  }, [mixpanel])

  const hideHeader = (name: string) => {
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
      {<Loader />}

      <NavigationContainer
        theme={scheme === 'dark' ? AppDarkTheme : AppLightTheme}
        ref={navigationRef}
        linking={linking} fallback={<Loading />}
      >
        <Stack.Navigator initialRouteName="Home"
          screenOptions={({ navigation, route }) => ({
            headerLeft: () => {
              return hideHeader(route.name) ? <></> :
                (<Pressable onPress={() => { navigation.navigate('ViewWallet'); }}>
                  <Avatar source={colorMode === 'dark' ? require('./assets/images/icon-green.png') : require('./assets/images/icon-green.png')} bg={Color.transparent} size="xs" m={1} ml={1} mr={6} mb={1}></Avatar>
                </Pressable>)
            },
            headerRight: () => {
              return hideHeader(route.name) ? <></> : <Menu navigation={navigation} route={route} setScheme={setScheme} />;
            }
          })}
          screenListeners={{
            state: (e) => {
              setRouteState(uuidv4());
            },
          }}
        >
          <Stack.Screen name="Home" component={LandingPage} options={{
            headerShown: false,
            headerTitle: "",
          }} ></Stack.Screen>
          <Stack.Screen name="Language" component={LanguagePage} options={{
            headerShown: false,
            headerTitle: "",
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
            title: translations[language as keyof typeof translations]?.SelectWallet?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="ViewWallet" component={ViewWallet} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations]?.ViewWallet?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="WalletHistory" component={WalletHistory} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations]?.WalletHistory?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="CreateNetwork" component={CreateNetwork} options={{
            title: translations[language as keyof typeof translations]?.CreateNetwork?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="SelectNetwork" component={SelectNetwork} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations]?.SelectNetwork?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="NetworkDefault" component={NetworkDefault} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations]?.SelectNetwork?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="ViewNetwork" component={ViewNetwork} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations]?.ViewNetwork?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="AddToken" component={AddToken} options={{
            headerTitleAlign: 'center',
            title: '',
          }} ></Stack.Screen>
          <Stack.Screen name="QRWallet" component={QRWallet} options={{
            title: translations[language as keyof typeof translations]?.Buttons_Header?.receive,
          }} ></Stack.Screen>
          <Stack.Screen name="SendToken" component={SendToken} options={{
            headerTitleAlign: 'center',
            title: '',
          }} ></Stack.Screen>
          <Stack.Screen name="SwapToken" component={SwapToken} options={{
            headerTitleAlign: 'center',
            title: ''//translations[language as keyof typeof translations]?.SwapToken?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="ViewToken" component={ViewToken} options={{
            headerTitleAlign: 'center',
            title: ''//translations[language as keyof typeof translations]?.SwapToken?.title,
          }} ></Stack.Screen>
          <Stack.Screen name="BuyToken" component={BuyToken} options={{
            headerTitleAlign: 'center',
            title: ''//translations[language as keyof typeof translations].SwapToken.title,
          }} ></Stack.Screen>
          <Stack.Screen name="SupportPage" component={SupportPage} options={{
            headerTitleAlign: 'center',
            title: ' ',
          }} ></Stack.Screen>
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
            headerTitleAlign: 'center',
            title: ' ',
          }} ></Stack.Screen>
          <Stack.Screen name="CodeCountry" component={CodeCountry} options={{
            headerTitleAlign: 'center',
            title: ' ',
          }} ></Stack.Screen>
          <Stack.Screen name="SendNotificationToken" component={SendNotificationToken} options={{
            headerTitleAlign: 'center',
            title: ' ',
          }} ></Stack.Screen>
          <Stack.Screen name="NFT" component={NftDashboard} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations].NftDashboard.title,
          }} ></Stack.Screen>
          <Stack.Screen name="QRReader" component={QRReader} options={{
            title: '',
          }} ></Stack.Screen>
          <Stack.Screen name="Connections" component={Connections} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations].Connections.title,
          }} ></Stack.Screen>
          <Stack.Screen name="Requests" component={Requests} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations].Requests.title,
          }} ></Stack.Screen>
          <Stack.Screen name="ConnectionManagement" component={ConnectionManagement} options={{
            headerTitleAlign: 'center',
            title: '',
          }} ></Stack.Screen>
          <Stack.Screen name="ConnectionRequest" component={ConnectionRequest} options={{
            title: '',
          }} ></Stack.Screen>
          <Stack.Screen name="SignTyped" component={SignTypedData} options={{
            headerTitleAlign: 'center',
            title: ' '//translations[language].SignTyped.title, 
          }} ></Stack.Screen>
          <Stack.Screen name="SignEth" component={EthSign} options={{
            headerTitleAlign: 'center',
            title: ' '//translations[language].SignEth.title, 
          }} ></Stack.Screen>
          <Stack.Screen name="SignTransaction" component={SignTransaction} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations].SignTransaction.header,
          }} ></Stack.Screen>
          <Stack.Screen name="SendTransaction" component={SendTransaction} options={{
            headerTitleAlign: 'center',
            title: ' '//translations[language].SendTransaction.title, 
          }} ></Stack.Screen>
          <Stack.Screen name="ExportWallet" component={ExportWallet} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations].ExportWallet.title,
          }} ></Stack.Screen>
          <Stack.Screen name="ProfileList" component={ProfileList} options={{
            headerTitleAlign: 'center',
            title: 'Profiles'//translations[language as keyof typeof translations].ProfileList.title,
          }} ></Stack.Screen>
          <Stack.Screen name="ViewProfile" component={Profile} options={{
            headerTitleAlign: 'center',
            title: 'Profile'//translations[language as keyof typeof translations].ProfileList.title,
          }} ></Stack.Screen>

          <Stack.Screen name="Ramp" component={RampWidget} options={{
            headerTitleAlign: 'center',
            title: ''//translations[language as keyof typeof translations].ProfileList.title,
          }} ></Stack.Screen>
          <Stack.Screen name="Unlimit" component={UnlimitWidget} options={{
            headerTitleAlign: 'center',
            title: ''//translations[language as keyof typeof translations].ProfileList.title,
          }} ></Stack.Screen>
          <Stack.Screen name="Extensions" component={SelectExtension} options={{
            headerTitleAlign: 'center',
            title: translations[language as keyof typeof translations].SelectExtension.title,
          }} ></Stack.Screen>
          <Stack.Screen name="Ubeswap" component={Ubeswap} options={{
            headerTitleAlign: 'center',
            title: ''//translations[language as keyof typeof translations].SelectExtension.title,
          }} ></Stack.Screen>
          <Stack.Screen name="EthicHub" component={EthicHub} options={{
            headerTitleAlign: 'center',
            title: ''//translations[language as keyof typeof translations].SelectExtension.title,
          }} ></Stack.Screen>
          {/*<Stack.Screen name="TransactionFeed" component={TransactionFeed} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].TransactionFeed.title,
            }} ></Stack.Screen>*/}
        </Stack.Navigator>
      </NavigationContainer>
      {/*<LensProvider theme={scheme === 'dark' ? Theme.dark : Theme.light} >
        <NavigationContainer
          theme={scheme === 'dark' ? AppDarkTheme : AppLightTheme}
          ref={navigationRef}
          linking={linking} fallback={<Loading />}
        >
          <Stack.Navigator initialRouteName="Home"
            screenOptions={({ navigation, route }) => ({
              headerLeft: () => {
                return hideHeader(route.name) ? <></> :
                  (<Pressable onPress={() => { navigation.navigate('ViewWallet'); }}>
                    <Avatar source={colorMode === 'dark' ? require('./assets/images/icon-green.png') : require('./assets/images/icon-green.png')} bg={Color.transparent} size="xs" m={1} ml={1} mr={6} mb={1}></Avatar>
                  </Pressable>)
              },
              headerRight: () => {
                return hideHeader(route.name) ? <></> : <Menu navigation={navigation} route={route} setScheme={setScheme} />;
              }
            })}
            screenListeners={{
              state: (e) => {
                setRouteState(uuidv4());
              },
            }}
          >
            <Stack.Screen name="Home" component={LandingPage} options={{
              headerShown: false,
              headerTitle: "",
            }} ></Stack.Screen>
            <Stack.Screen name="Language" component={LanguagePage} options={{
              headerShown: false,
              headerTitle: "",
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
              title: translations[language as keyof typeof translations]?.SelectWallet?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="ViewWallet" component={ViewWallet} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations]?.ViewWallet?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="WalletHistory" component={WalletHistory} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations]?.WalletHistory?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="CreateNetwork" component={CreateNetwork} options={{
              title: translations[language as keyof typeof translations]?.CreateNetwork?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="SelectNetwork" component={SelectNetwork} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations]?.SelectNetwork?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="NetworkDefault" component={NetworkDefault} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations]?.SelectNetwork?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="ViewNetwork" component={ViewNetwork} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations]?.ViewNetwork?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="AddToken" component={AddToken} options={{
              headerTitleAlign: 'center',
              title: '',
            }} ></Stack.Screen>
            <Stack.Screen name="QRWallet" component={QRWallet} options={{
              title: translations[language as keyof typeof translations]?.Buttons_Header?.receive,
            }} ></Stack.Screen>
            <Stack.Screen name="SendToken" component={SendToken} options={{
              headerTitleAlign: 'center',
              title: '',
            }} ></Stack.Screen>
            <Stack.Screen name="SwapToken" component={SwapToken} options={{
              headerTitleAlign: 'center',
              title: ''//translations[language as keyof typeof translations]?.SwapToken?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="ViewToken" component={ViewToken} options={{
              headerTitleAlign: 'center',
              title: ''//translations[language as keyof typeof translations]?.SwapToken?.title,
            }} ></Stack.Screen>
            <Stack.Screen name="BuyToken" component={BuyToken} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].SwapToken.title,
            }} ></Stack.Screen>
            <Stack.Screen name="SupportPage" component={SupportPage} options={{
              headerTitleAlign: 'center',
              title: ' ',
            }} ></Stack.Screen>
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
              headerTitleAlign: 'center',
              title: ' ',
            }} ></Stack.Screen>
            <Stack.Screen name="CodeCountry" component={CodeCountry} options={{
              headerTitleAlign: 'center',
              title: ' ',
            }} ></Stack.Screen>
            <Stack.Screen name="SendNotificationToken" component={SendNotificationToken} options={{
              headerTitleAlign: 'center',
              title: ' ',
            }} ></Stack.Screen>
            <Stack.Screen name="NFT" component={NftDashboard} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].SwapToken.title,
            }} ></Stack.Screen>
            <Stack.Screen name="QRReader" component={QRReader} options={{
              title: '',
            }} ></Stack.Screen>
            <Stack.Screen name="Connections" component={Connections} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].Connections.title,
            }} ></Stack.Screen>
            <Stack.Screen name="Requests" component={Requests} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].Requests.title,
            }} ></Stack.Screen>
            <Stack.Screen name="ConnectionManagement" component={ConnectionManagement} options={{
              headerTitleAlign: 'center',
              title: '',
            }} ></Stack.Screen>
            <Stack.Screen name="ConnectionRequest" component={ConnectionRequest} options={{
              title: '',
            }} ></Stack.Screen>
            <Stack.Screen name="SignTyped" component={SignTypedData} options={{
              headerTitleAlign: 'center',
              title: ' '//translations[language].SignTyped.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SignEth" component={EthSign} options={{
              headerTitleAlign: 'center',
              title: ' '//translations[language].SignEth.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="SignTransaction" component={SignTransaction} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].SignTransaction.header,
            }} ></Stack.Screen>
            <Stack.Screen name="SendTransaction" component={SendTransaction} options={{
              headerTitleAlign: 'center',
              title: ' '//translations[language].SendTransaction.title, 
            }} ></Stack.Screen>
            <Stack.Screen name="ExportWallet" component={ExportWallet} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].ExportWallet.title,
            }} ></Stack.Screen>
            <Stack.Screen name="ProfileList" component={ProfileList} options={{
              headerTitleAlign: 'center',
              title: 'Profiles'//translations[language as keyof typeof translations].ProfileList.title,
            }} ></Stack.Screen>
            <Stack.Screen name="ViewProfile" component={Profile} options={{
              headerTitleAlign: 'center',
              title: 'Profile'//translations[language as keyof typeof translations].ProfileList.title,
            }} ></Stack.Screen>

            <Stack.Screen name="Ramp" component={RampWidget} options={{
              headerTitleAlign: 'center',
              title: ''//translations[language as keyof typeof translations].ProfileList.title,
            }} ></Stack.Screen>
            <Stack.Screen name="Extensions" component={SelectExtension} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].SelectExtension.title,
            }} ></Stack.Screen>
            <Stack.Screen name="Ubeswap" component={Ubeswap} options={{
              headerTitleAlign: 'center',
              title: ''//translations[language as keyof typeof translations].SelectExtension.title,
            }} ></Stack.Screen>
            <Stack.Screen name="EthicHub" component={EthicHub} options={{
              headerTitleAlign: 'center',
              title: ''//translations[language as keyof typeof translations].SelectExtension.title,
            }} ></Stack.Screen>
            {/*<Stack.Screen name="TransactionFeed" component={TransactionFeed} options={{
              headerTitleAlign: 'center',
              title: translations[language as keyof typeof translations].TransactionFeed.title,
            }} ></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer >
      </LensProvider >* /}
    {/*<Listener />*/ }
    </SafeAreaProvider >
  )
}

export const ToggleDarkMode = ({ setScheme }: { setScheme: Function }) => {
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

/**
 * <Stack.Screen name="NFTs" component={NftList} options={{ 
      headerTitleAlign: 'center',
      title: 'NFTs', 
    }} ></Stack.Screen>
 */