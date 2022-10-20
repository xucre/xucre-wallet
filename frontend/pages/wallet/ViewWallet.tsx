import { MaterialIcons } from "@expo/vector-icons";
import arrayShuffle from 'array-shuffle';
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  Divider,
  Drawer,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import { convertRemToAbsolute } from "native-base/lib/typescript/theme/tools";
import React, {createRef, useEffect, useState} from "react";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import DashboardLayout from '../../layouts/DashboardLayout';
import { activeNetwork, activeWallet, networkList, language as stateLanguage, } from "../../service/state";
import { truncateString } from "../../service/utility";

function TabItem({
  tabName,
  currentTab,
  handleTabChange,
}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} px="4" pt="2">
      <VStack>
        <Text
          fontSize="sm"
          fontWeight="medium"
          letterSpacing="0.4"
          _light={{
            color: tabName === currentTab ? 'primary.900' : 'coolGray.500',
          }}
          _dark={{
            color: tabName === currentTab ? 'primary.500' : 'coolGray.400',
          }}
          px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            borderTopLeftRadius="sm"
            borderTopRightRadius="sm"
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            h="1"
          />
        )}
      </VStack>
    </Pressable>
  );
}

export default function ViewWallet ({navigation, route}) {
  const [language,] = useRecoilState(stateLanguage);
  const [currentTab, setCurrentTab] = useState(translations[language].ViewWallet.tab_list[0]);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [network, setNetwork] = useRecoilState(activeNetwork);
  const [networks, setAllNetworks] = useRecoilState(networkList);
  const [holdings, setHoldings] = useState([]);
  const tabList = translations[language].ViewWallet.tab_list;

  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);


  useEffect(() => {
    if (_wallet.name === '') {
      navigation.navigate('SelectWallet');
    }
    setHoldings([]);
    console.log('wallet:',_wallet.name,'network', network)
    if (_wallet.name != '' && network) {
      const _provider = getDefaultProvider(network.rpcUrl);
      setProvider(_provider);
      const newWallet = _wallet.wallet.connect(_provider);
      //console.log(newWallet);
      setWallet(newWallet);
    }
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
      try {
        console.log('testing provider')
        if (provider.getBlockNumber) {
          const currentBlock = await provider.getBlockNumber();
          
          //console.log('currentBlock',currentBlock);
          if (wallet.address && currentBlock > 0) {
            const walletBalance = await wallet.getBalance();
            //console.log('balance',walletBalance);
            const coinToken = {
              amount : ethers.utils.formatEther( walletBalance ),
              name: network.symbol,
            };
            setHoldings([...holdings, coinToken]);
          }
        }        
      } catch (e) {
        console.log(e);
      }
        
      
    }

    runAsync();
  }, [wallet, provider])

  const copyToClipboard = () => {
    console.log('copyToClipboard', wallet.address);
    Clipboard.setStringAsync(String(wallet.address));
    setDisplayTooltip(true);
    setTimeout(() => {
      setDisplayTooltip(false);
    }, 1000)
  };

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
  }

  const HoldingItem = ({token}) => {
    const selectNetwork= () => {
      //
      //console.log(metadata);
      //viewNetwork();
    }
    return (
      <HStack alignItems="center" justifyContent="space-between">        
        <HStack alignItems="center" space={{ base: 3, md: 6 }}>
          <VStack space={1}>
            <Text fontSize="md" bold>
              {token.name}
            </Text>
          </VStack>
          
          <Text color="coolGray.500">{token.amount}</Text>     
        </HStack>
      </HStack>
    )
  }

  return (
    <DashboardLayout title={_wallet.name}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        <VStack space={4} p={3}>
          <Text fontSize={'lg'}>{_wallet.name}</Text>
          
            <Tooltip label="Copied to clipboard" isOpen={displayTooltip} bg="indigo.500" _text={{
              color: "#fff"
            }}>
              <Button onPress={copyToClipboard}><Text>{_wallet.wallet.address}</Text></Button>
            </Tooltip>
        </VStack>
        <HStack
          mt={5}
          _light={{
            bg: 'coolGray.100',
          }}
          _dark={{
            bg: 'coolGray.700',
          }}
          w="100%"
          justifyContent="space-around"
          borderRadius="sm"
        >
          {
            tabList.map((tab, index) => {
              return (
                <TabItem key={index} tabName={tab} currentTab={currentTab} handleTabChange={handleTabChange} />
              )
            })
          }
        </HStack>
        
        <VStack space="5" px={2}>
          {currentTab == translations[language].ViewWallet.tab_list[0] && wallet.address !== '' &&
            <Box m={6}>
              <VStack space={2}>
                {
                  holdings.map((val, i) => {

                    return (
                      <HoldingItem key={val.name+i} token={val} />
                    )
                  })
                }
              </VStack>
            </Box>
          }

          {currentTab == translations[language].ViewWallet.tab_list[1] &&
            <Center m={6}>
              <Text>{translations[language].ViewWallet.transactions_placeholder}</Text>
            </Center>
          }
        </VStack>
        
      </Box>
    </DashboardLayout>
  )
}