import {
  ArrowBackIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  HStack,
  IconButton,
  MoonIcon,
  Pressable,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { useRecoilState } from "recoil";


import { Color } from "../../GlobalStyles";
import translations from "../assets/translations";
//import { navigate } from '../service/RootNavigation';
import { constructDefaultNetworks } from "../service/network";
import { activeNetwork, AppWallet, language, networkList, walletList, } from "../service/state";
import { loadWalletFromPrivateKey } from "../service/wallet";
import { getActiveNetwork, getNetworks, storeActiveNetwork, storeNetworks, } from "../store/network";
import { storeTheme } from '../store/setting';
import { getWallets } from "../store/wallet";


import NetworkIcon from './NetworkIcon';
import PasswordPage, { needsAuth } from "./Password";

export default function SideBar({ navigation, route, setScheme }: { navigation: { navigate: Function }, route: any, setScheme: Function }) {
  const appState = useRef(AppState.currentState);
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [authNeeded, setAuthNeeded] = useState(false);
  const [_language,] = useRecoilState(language);
  const [isComponentMounted, setIsComponentMounted] = useState(true);


  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  const {
    colorMode,
    setColorMode
  } = useColorMode();

  useEffect(() => {
    const runAsync = async () => {
      //
    }

    runAsync();
  });

  const [, setWalletState] = useRecoilState(walletList);
  const [, setNetworkList] = useRecoilState(networkList);
  const [_activeNetwork, setActiveNetwork] = useRecoilState(activeNetwork);
  useEffect(() => {
    const runAsync = async () => {
      const _networks = await getNetworks();
      //await storeNetworks([])
      if (!Array.isArray(_networks) || _networks.length === 0) {
        const _newNetworks = constructDefaultNetworks();
        setNetworkList(_newNetworks);
        await storeNetworks(_newNetworks);
        if (!_activeNetwork) {
          setActiveNetwork(_newNetworks[0]);
          await storeActiveNetwork(_newNetworks[0]);
        }
      }
      if (!_activeNetwork) {
        const currentNetwork = await getActiveNetwork();
        setActiveNetwork(currentNetwork);
      }

      const _wallets = await getWallets();
      if (Array.isArray(_wallets) && _wallets.length > 0) {
        const loadedWallets = _wallets.map((val) => {
          const wallet = loadWalletFromPrivateKey(val.wallet);
          if (wallet) {
            return { address: wallet.address, name: val.name, wallet: wallet.privateKey };
          }
        });
        if (loadedWallets) {
          setWalletState(loadedWallets as AppWallet[]);
        }
      } else {
        //navigate('NewWallet')
      }

      await validateAuth();


    }

    runAsync();
  }, [])

  const navigate = (_location: string) => {
    //if (isComponentMounted) {
    setDrawerStatus(false);
    navigation.navigate(_location);
    //}
  }

  const validateAuth = async () => {
    const _authNeeded = await needsAuth();
    console.log(_authNeeded);
    setAuthNeeded(_authNeeded);
  }

  function WalletLink() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('SelectWallet'); }}
        >
          <Text>{translations[_language as keyof typeof translations].Menu.wallet_button}</Text>
        </Button>
      </VStack>
    );
  }

  function QRScan() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('QRReader'); }}
        >
          <Text>{translations[_language as keyof typeof translations].Menu.qr_scan_button}</Text>
        </Button>
      </VStack>
    );
  }

  function NFTs() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('NFTs'); }}
        >
          <Text>{translations[_language as keyof typeof translations].Menu.nft_button}</Text>
        </Button>
      </VStack>
    );
  }

  function Connections() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('Connections'); }}
        >
          <Text>{translations[_language as keyof typeof translations].Menu.connections_button || 'Connections'}</Text>
        </Button>
      </VStack>
    );
  }

  function Requests() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('Requests'); }}
        >
          <Text>{translations[_language as keyof typeof translations].Menu.requests_button || 'Requests'}</Text>
        </Button>
      </VStack>
    );
  }

  function NetworkLink() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('SelectNetwork'); }}
        >
          <Text>{translations[_language as keyof typeof translations].Menu.network_button}</Text>
        </Button>
      </VStack>
    );
  }

  function SelectLanguageLink() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('Language'); }}
        >
          <Text>{translations[_language as keyof typeof translations].LanguagePage.menu_button}</Text>
        </Button>
      </VStack>
    );
  }

  function SetPassword() {
    return (
      <VStack space={4} mt={{ base: 0 }}>
        <Button
          variant="outline"
          my={1}
          colorScheme={'yellow'}
          rounded={100}
          px={10}
          onPress={() => { navigate('SetPassword'); }}
        >
          <Text>{translations[_language as keyof typeof translations].Menu.password_button}</Text>
        </Button>
      </VStack>
    );
  }

  return (
    <Box
      _light={{ bg: Color.white }}
      _dark={{ bg: Color.black }}
    >
      {!drawerStatus &&
        <IconButton onPress={() => setDrawerStatus(!drawerStatus)} colorScheme={'dark'} key={'copyButton'} variant={'ghost'} _icon={{
          as: MaterialIcons,
          name: "menu"
        }} />
      }
      <Drawer
        isOpen={drawerStatus}
        onClose={() => { setDrawerStatus(false) }}
        placement={'top'}
      >
        <VStack
          space={0}
          _light={{ bg: Color.white }}
          _dark={{ bg: Color.black }}
          safeAreaTop
        >
          <HStack justifyContent={'space-between'} pt={4} pb={0}>
            <Pressable onPress={() => { setDrawerStatus(true); navigate('ViewWallet'); }}>
              <Avatar source={
                colorMode === 'dark' ? require('../assets/images/icon-green.png') : require('../assets/images/icon-green.png')
              } size="sm" bg={Color.transparent} m={1} ml={2} mb={1} mt={2}></Avatar>
            </Pressable>

            {/*<SelectLanguage />*/}
            {<NetworkIcon navigation={navigation} close={setDrawerStatus} />}
            {<ToggleDarkMode setScheme={setScheme} />}
            {/*<BackButton setDrawerStatus={setDrawerStatus}/>*/}
          </HStack>

          <Divider my="2" />
          {
            //<Button onPressIn={() => {storage.clear()}} variant="outline" >Clear Queue</Button>
          }
          <VStack space={0}>
            <SelectLanguageLink />
            <NetworkLink />
            <WalletLink />
            <Connections />
            <Requests />
            <QRScan />
            {/*<SetPassword />*/}
          </VStack>

          <Box my={'2'}></Box>


        </VStack>
      </Drawer>
      {authNeeded &&
        <PasswordPage navigation={navigation} route={route} validateAuth={validateAuth}></PasswordPage>
      }
    </Box>
  );
}

export const ToggleDarkMode = ({ setScheme }: { setScheme: Function }) => {
  const {
    colorMode,
    setColorMode
  } = useColorMode();

  const [lastValue, setLastValue] = useState(colorMode);

  useEffect(() => {
    const runAsync = async () => {
      await storeTheme(colorMode);
      setLastValue(colorMode);
      setScheme(colorMode);
    }

    if (colorMode !== lastValue) {
      runAsync();
    }

  }, [colorMode]);

  return (
    <Pressable onPress={() => colorMode === "light" ? setColorMode("dark") : setColorMode("light")} m={2} mt={3}>
      {useColorModeValue(<MoonIcon size={6} />, <SunIcon size={6} />)}
    </Pressable>
  )
}

export const BackButton = ({ setDrawerStatus }: { setDrawerStatus: Function }) => {
  return (
    <Pressable onPressIn={() => { setDrawerStatus(false) }} pr={2}>
      {<ArrowBackIcon size={6}></ArrowBackIcon>}
    </Pressable>
  )
}