import { MaterialIcons } from "@expo/vector-icons";
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import {
  Alert,
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  CloseIcon,
  ColorMode,
  Divider,
  Drawer,
  Hidden,
  HStack,
  IconButton,
  Icon as IconElement,
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
import React, {createRef, useEffect, useState} from "react";
import { RefreshControl } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import TokenItem from '../../components/token/TokenItem';
import TransactionItem from "../../components/transaction/TransactionItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { activeNetwork, activeWallet, networkList, language as stateLanguage } from "../../service/state";
import { Transaction } from "../../service/transaction";
import { truncateString } from "../../service/utility";
import { iconNames } from '../../store/network';
import { getTokenByChain } from '../../store/token';
import { getTransactionsByChainAndWallet, storeTransactions } from '../../store/transaction';

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
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTab, setCurrentTab] = useState(translations[language].ViewWallet.tab_list[0]);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [network, setNetwork] = useRecoilState(activeNetwork);
  const [networks, setAllNetworks] = useRecoilState(networkList);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([] as readonly Transaction[]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  const tabList = translations[language].ViewWallet.tab_list;

  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);
  
  const syncTokens = async () => {
    const _tokens = await getTokenByChain(network.chainId);
    const coinToken = {
      address : '',
      amount : ethers.utils.formatEther( 0 ),
      chainId : network.chainId,
      name: network.symbol,
      type: 'coin',
    };
    if (isComponentMounted) {
      setHoldings([coinToken, ..._tokens]);
    }
  }
  
  const syncTransactions = async () => {
    //console.log(network.chainId, _wallet.wallet.address);
    const _transactions = await getTransactionsByChainAndWallet(network.chainId, _wallet.wallet.address);
    //console.log(_transactions);
    if (isComponentMounted) {
      setTransactions(_transactions);
      
    }
  }

  const clearTransactions = () => {
    const runAsync = async () => {
      await storeTransactions([] as readonly Transaction[]);
      await syncTransactions();
      setLoading(false);
    }
    setLoading(true);
    runAsync();    
  }

  useEffect(() => {
    if (_wallet.name === '') {
      navigation.navigate('SelectWallet');
    } else {
      setWallet(_wallet.wallet);
    }
  }, [_wallet, network]);

  useEffect(() => {    
    //setHoldings([]);
    setTimeout(() => {
      syncTokens();
      syncTransactions();
    }, 1000)
  }, [])

  const copyToClipboard = () => {
    console.log('copyToClipboard', wallet.address);
    Clipboard.setStringAsync(String(wallet.address));
    setDisplayTooltip(true);
    setTimeout(() => {
      setDisplayTooltip(false);
    }, 1000)
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setHoldings([]);
    setTransactions([]);
    
    setTimeout(async() => {
      await syncTokens();
      await syncTransactions();
      setRefreshing(false);
    }, 100)
  }, []);
  
  const addToken = () => {
    navigation.navigate('AddToken');
  }

  const receiveFunds = () => {
    navigation.navigate('QRWallet');
  }
  
  const sendFunds = () => {
    navigation.navigate('SendToken');
  }

  const swapTokens = () => {
    navigation.navigate('SwapToken');
  }

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
  }

  return (
    <DashboardLayout title={_wallet.name}>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
        safeAreaBottom
      >
        <VStack space={4} p={3}>
          <Text fontSize={'lg'}>{_wallet.name}</Text>
          
            <Tooltip label="Copied to clipboard" isOpen={displayTooltip} bg="indigo.500" _text={{
              color: "#fff"
            }}>
              <Button onPress={copyToClipboard}><Text>{_wallet.wallet.address}</Text></Button>
            </Tooltip>
        </VStack>
        <HStack my={2}>
          <Button.Group isAttached colorScheme="muted" size="full">
            <Button onPress={receiveFunds} width={'1/3'} py={3}><Text>Recieve</Text></Button>
            <Button width={'1/3'} py={3} colorScheme={'darkBlue'} onPress={swapTokens} ><Text>Swap</Text></Button>
            <Button width={'1/3'} py={3} variant={'outline'} onPress={sendFunds} ><Text>Send</Text></Button>
          </Button.Group>
        </HStack>
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
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <VStack space="5" px={2} mb={10}>
            {currentTab == translations[language].ViewWallet.tab_list[0] && wallet.address !== '' &&
              <Box m={6} >
                <VStack space={2} >
                  {
                    holdings.map((val, i) => {
                      return (                        
                        <TokenItem key={val.name+i} token={val} navigation={navigation}/>                        
                      )
                    })
                  }
                </VStack>
                
                
                
              </Box>
            }

            {currentTab == translations[language].ViewWallet.tab_list[1] &&
              <Box m={6} >
                <VStack space={2} direction={'column-reverse'}>
                  {
                    transactions.map((val, i) => {
                      return (                        
                        <TransactionItem key={val.hash+iconNames} transaction={val} navigation={navigation}/>                        
                      )
                    })
                  }
                </VStack>
              </Box>
            }
          </VStack>
        </ScrollView>
        {currentTab == translations[language].ViewWallet.tab_list[0] && wallet.address !== '' &&
          <Button onPress={addToken} mt={4} width={'full'} position={'absolute'} bottom={0}><Text>{translations[language].ViewWallet.new_button}</Text></Button>
        }
        
        {currentTab == translations[language].ViewWallet.tab_list[1] && transactions.length > 0 &&
          <Button onPress={clearTransactions} mt={4} width={'full'} position={'absolute'} bottom={0} isLoading={loading}><Text>{translations[language].ViewWallet.clear_button}</Text></Button>
        }
      </Box>
    </DashboardLayout>
  )
}