import { MaterialIcons } from "@expo/vector-icons";
import { ethers } from 'ethers';
import {
  AlertDialog,
  ArrowBackIcon,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  MoonIcon,
  Pressable,
  SunIcon,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {useEffect, useRef, useState} from "react";
import { AppState } from "react-native";
import { useRecoilState } from "recoil";


import translations from "../assets/translations";
import { constructDefaultNetworks } from "../service/network";
import { activeNetwork, language, networkList, walletList, } from "../service/state";
import { loadWalletFromPrivateKey } from "../service/wallet";
import { createLegacySignClient, legacySignClient } from "../service/walletConnectLegacy";
import { getActiveNetwork, getNetworks, storeActiveNetwork, storeNetworks, } from "../store/network";
import { getWCLegacyUrl } from "../store/setting";
import { getTheme, storeTheme } from '../store/setting';
import { getWallets } from "../store/wallet";

import PasswordPage, { needsAuth } from "./Password";
import SelectLanguage from "./SelectLanguage";

export default function SideBar ({navigation, route, setScheme, storage}) {
  const appState = useRef(AppState.currentState);
  const [drawerStatus, setDrawerStatus] = useState(false);
  const [authNeeded, setAuthNeeded] = useState(false);
  const [_language, ] = useRecoilState(language);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        validateAuth();
        console.log("App has come to the foreground!");
      }
      // eslint-disable-next-line functional/immutable-data
      appState.current = nextAppState;
      console.log("AppState", appState.current);
    });
    validateAuth();
    return () => {
      subscription.remove();
    };
  }, []);

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
      const clientTheme = await getTheme();
      if (!clientTheme) {
        console.log('setting default theme');
        await storeTheme('light');
        setScheme('light');
      } else {
        //console.log('setting existing theme:', clientTheme);
        setColorMode(clientTheme);
        setScheme(clientTheme);
      }
      
      if (!legacySignClient) {
        createLegacySignClient();
      }
      //await storeTheme(colorMode);
    }
    
    runAsync();
  }, []);

  const [walletState, setWalletState] = useRecoilState(walletList);
  const [,setNetworkList] = useRecoilState(networkList);
  const [,setActiveNetwork] = useRecoilState(activeNetwork);
  useEffect(() => {
    const runAsync = async () => {
      const _networks = await getNetworks();
      //await storeNetworks([])
      if (!Array.isArray(_networks) || _networks.length === 0) {
        const _newNetworks = constructDefaultNetworks();
        setNetworkList(_newNetworks);
        setActiveNetwork(_newNetworks[0]);
        await storeNetworks(_newNetworks);
        await storeActiveNetwork(_newNetworks[0]);
      }
      
      const currentNetwork = await getActiveNetwork();        
      setActiveNetwork(currentNetwork);    

      const _wallets = await getWallets();
      //console.log('menu get wallets',_wallets);
      if (Array.isArray(_wallets) && _wallets.length > 0) {
        const loadedWallets = _wallets.map((val) => {
          const wallet = loadWalletFromPrivateKey(val.wallet);
          return {address: wallet.address, name: val.name, wallet: wallet};
        });
        setWalletState(loadedWallets);
      };

      
    }

    runAsync();
  }, [])

  const navigate = (_location) => {
    //if (isComponentMounted) {
      setDrawerStatus(false);
      navigation.navigate(_location);
    //}
  }

  const validateAuth = async () => {
    const _authNeeded = await needsAuth();
    console.log('authNeeded:', _authNeeded);
    if (_authNeeded) {
      console.log('authorization needed'); 
    }
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
            onPress={() => {navigate('SelectWallet');}}          
          >
            <Text>{translations[_language].Menu.wallet_button}</Text>
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
            onPress={() => {navigate('QRReader');}}          
          >
            <Text>{translations[_language].Menu.qr_scan_button}</Text>
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
            onPress={() => {navigate('NFTs');}}          
          >
            <Text>{translations[_language].Menu.nft_button}</Text>
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
            onPress={() => {navigate('SelectNetwork');}}          
          >
            <Text>{translations[_language].Menu.network_button}</Text>
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
            onPress={() => {navigate('SetPassword');}}          
          >
            <Text>{translations[_language].Menu.password_button}</Text>
          </Button>
      </VStack>
    );
  }

  return (
    <>
      { !drawerStatus && 
        <IconButton onPress={() => {setDrawerStatus(true)}} variant="ghost" colorScheme={colorMode === 'light'? 'coolGray': 'warmGray'} _icon={{
          as: MaterialIcons,
          name: "menu"
        }} />
      }
      <Drawer
        isOpen={drawerStatus}
        onClose={() => {setDrawerStatus(false)}}
        placement={'top'}
      >
        <VStack 
          space={0} 
          _light={{ bg: 'white' }}
          _dark={{ bg: '#1b1e24' }}
          safeAreaTop
        >
          <HStack justifyContent={'space-between'} py={4} pb={1}>
            <ToggleDarkMode setScheme={setScheme} />
            <SelectLanguage />
            <BackButton setDrawerStatus={setDrawerStatus}/>              
          </HStack>
          
          <Divider my="2" />
          {
            //<Button onPressIn={() => {storage.clear()}} variant="outline" >Clear Queue</Button>
          }
          <VStack space={0}>
            <NetworkLink/>
            <WalletLink/>
            <QRScan />
            <SetPassword />
          </VStack>

          <Box my={'2'}></Box>

          
        </VStack>
      </Drawer>
      { authNeeded && 
        <PasswordPage navigation={navigation} route={route} validateAuth={validateAuth}></PasswordPage>
      }
    </>
  );
}

export const ToggleDarkMode = ({setScheme}) => {
  const {
    colorMode,
    setColorMode
  } = useColorMode();

  useEffect(() => {
    const runAsync = async () => {
      await storeTheme(colorMode);
    }
    
    console.log('setting from menu button', colorMode);
    setScheme(colorMode);
    runAsync();
  }, [colorMode]);

  return (
    <Pressable onPress={() => colorMode === "light" ? setColorMode("dark") : setColorMode("light")} pl={2}>
      {useColorModeValue(<MoonIcon size={6} />, <SunIcon size={6} />)}
    </Pressable>
  )
}

export const BackButton = ({setDrawerStatus}) => {
  return (
    <Pressable onPressIn={() => {setDrawerStatus(false)}} pr={2}>
      {<ArrowBackIcon size={6}></ArrowBackIcon>}
    </Pressable>
  )
}


