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
  Heading,
  Hidden,
  HStack,
  Icon,
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
import MobileFooter from "../../components/Footer";
import TokenItem from '../../components/token/TokenItem';
//import TransactionItem from "../../components/transaction/TransactionItem";
import CovalentItem from "../../components/transaction/CovalentItem";
import TotalBalance from "../../components/wallet/TotalBalance";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getWalletTransactions } from "../../service/api";
import { chainIdToNameMap } from "../../service/constants";
import { activeNetwork, activeWallet, networkList, language as stateLanguage } from "../../service/state";
import { CovalentTransaction, Transaction } from "../../service/transaction";
import { truncateString } from "../../service/utility";
import { iconNames } from '../../store/network';
import { getTokenByChain } from '../../store/token';
import { getTransactionsByChainAndWallet, storeTransactions } from '../../store/transaction';
import NftList from "../nft/NftList";

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
            color: tabName === currentTab ? 'gray.700' : 'gray.700',
          }}
          _dark={{
            color: tabName === currentTab ? 'gray.100' : 'gray.100',
          }}
          px={4}
          py={2}
        >
          {tabName}
        </Text>
        {tabName === currentTab && (
          <Box
            _light={{
              bg: 'primary.900',
            }}
            _dark={{
              bg: 'primary.500',
            }}
            marginBottom={-1}
            h="0.5"
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
  const [network, ] = useRecoilState(activeNetwork);
  const [networks, setAllNetworks] = useRecoilState(networkList);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([] as readonly CovalentTransaction[]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      //setIsComponentMounted(false);
    }
  }, []);
  const tabList = translations[language].ViewWallet.tab_list;
  //Buttons

  const buttonSend = translations[language].Buttons_Header.send;
  const buttonReceive = translations[language].Buttons_Header.receive;
  const buttonBuy = translations[language].Buttons_Header.buy;
  const buttonNft = translations[language].Buttons_Header.nft;
  const buttonConnect = translations[language].Buttons_Header.connect;


  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);
  
  const syncTokens = async () => {
    const _tokens = await getTokenByChain(network.chainId);
    //console.log('tokens', _tokens);
    const coinToken = {
      address : '',
      amount : ethers.utils.formatEther( 0 ),
      chainId : network.chainId,
      name: network.symbol,
      type: 'coin',
    };
    console.log('mounted component', isComponentMounted)
    if (isComponentMounted) {
      setHoldings([coinToken, ..._tokens]);
    }
  }
  
  const syncTransactions = async () => {
    //console.log(network.chainId, _wallet.wallet.address);
    console.log('loading transactions $$$');
    const _transactions = await getWalletTransactions(_wallet.wallet.address, chainIdToNameMap[network.chainId]);
    //console.log(_transactions.data.items[0]);
    if (_transactions.data.items) {
      console.log('setting transactions');
      setTransactions(_transactions.data.items as readonly CovalentTransaction[]);
    }
  }

  const clearTransactions = () => {
    const runAsync = async () => {
      //await storeTransactions([] as readonly CovalentTransaction[]);
      await syncTransactions();
      setLoading(false);
    }
    setLoading(true);
    runAsync();    
  }

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    } else if (network) {
      console.log(_wallet.wallet.address);
      setWallet(_wallet.wallet);
    }

    //console.log('ViewWallet', network.chainId);
  }, [_wallet, network]);

  useEffect(() => {    
    //setHoldings([]);
    setTimeout(() => {
      if(holdings.length === 0) {
        syncTokens();
      }
      //console.log(transactions[0]);
      if (transactions.length === 0) {
        syncTransactions();
      }      
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

  const openNft = () => {
    navigation.navigate('NFT');
  }

  const buyTokens = () =>{
    navigation.navigate('BuyToken');
  }

  const connectWallet = () => {
    navigation.navigate('QRReader');
  }


  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
  }

  const middleButtons = [
    {
        action: sendFunds,
        icon: "arrow-right-alt",
        text: buttonSend,
    },
    {
        action: buyTokens,
        icon: "monetization-on",
        text: buttonBuy,
    },
    {
        action: receiveFunds,
        icon: "arrow-downward",
        text: buttonReceive,
    },
    {
      action: connectWallet,
      icon: "qr-code-2",
      text: buttonConnect,
  },
  ];

  return (
    <DashboardLayout title={_wallet.name}>
      {network && network.rpcUrl === '' && 
        <Center         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: 'black' }}
        height={'100%'}
        justifyContent={'center'}
        safeAreaBottom
        >
          <Center bg={colorMode === 'dark' ? "primary.400" : "tertiary.500"} _text={{
            color: "white",
            fontWeight: "bold"
          }} height={200} width={{
            base: 200,
            lg: 250
          }}>
              <Text fontSize="md" _light={{color: 'lightText'}} _dark={{color: 'darkText'}} bold={true}>{translations[language].ViewWallet.no_network_error}</Text>
            </Center>
        </Center>
      }
      {network && network.rpcUrl !== '' && 
          <Box         
          _light={{ backgroundColor: 'white' }}
          _dark={{ backgroundColor: 'black' }}
          height={'100%'}
          safeAreaBottom
        >
          {
            /*<VStack space={4} p={3}>
              <HStack justifyContent={'space-between'}>
                <Text fontSize={'lg'}>{_wallet.name}</Text>
                <Badge rounded={6} variant={'solid'} >
                  <Text color={'lightText'}>{network.chainId}</Text>
                </Badge>
              </HStack>            
              <Tooltip label="Copied to clipboard" isOpen={displayTooltip} bg="indigo.500" _text={{
                color: "#fff"
              }}>
                <Button onPress={copyToClipboard}><Text>{_wallet.wallet.address}</Text></Button>
              </Tooltip>           
            </VStack>*/
          }

          {
            <TotalBalance />
          }
          {
            /*<HStack my={2}>
              <Button.Group isAttached colorScheme="muted" size="full">
                <Button onPress={receiveFunds} width={'1/3'} py={3}><Text>Recieve</Text></Button>
                <Button width={'1/3'} py={3} colorScheme={'darkBlue'} onPress={swapTokens} ><Text>Swap</Text></Button>
                <Button width={'1/3'} py={3} variant={'outline'} onPress={sendFunds} ><Text>Send</Text></Button>
              </Button.Group>
            </HStack>*/
          }
          <HStack space="4" alignItems="center" justifyContent={'space-around'} marginTop={2} marginLeft={2} marginRight={2}>
            {
              middleButtons.map((btn, i) => {
                return (
                  <Button
                    key={'middleButtons'+i}
                    variant="solid"
                    backgroundColor={'gray.700'}
                    _stack={{
                      flexDirection: 'column'
                    }}
                    flex={.25}
                    startIcon={
                      <Icon
                        as={MaterialIcons}
                        name={btn.icon}
                        color={'white'}
                        size="5"
                      />
                    }
                    _text={{
                      color: 'white'
                    }} 
                    paddingY={4}
                    paddingX={3}
                    borderRadius={10}           
                    onPress={btn.action}
                  >
                    <Text color={'white'}>{btn.text}</Text>
                  </Button> 
                )
              })
            }
            
          </HStack>
          <HStack
            mt={5}
            borderBottomWidth={1}
            borderBottomColor={'gray.100'}
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
                          <TokenItem key={val.name+i} token={val} navigation={navigation} refreshList={onRefresh}/>                        
                        )
                      })
                    }
                  </VStack>
                  <Button onPress={addToken} mt={4} width={'full'} colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}><Text color={colorMode === 'dark' ? 'black' : 'white'}>{translations[language].ViewWallet.new_button}</Text></Button>
                </Box>
              }

              {currentTab == translations[language].ViewWallet.tab_list[1] &&
                <Box m={6} >
                  <VStack space={2} direction={'column-reverse'}>
                    {
                      transactions.map((val, i) => {
                        return (                        
                          <CovalentItem key={val.tx_hash} transaction={val} navigation={navigation}/>                        
                        )
                      })
                    }
                  </VStack>
                </Box>
              }

              {currentTab == translations[language].ViewWallet.tab_list[2] &&
                <Box my={6} >
                  <NftList navigation={navigation} route={route}/>
                </Box>
              }
            </VStack>
          </ScrollView>
          
          {false && currentTab == translations[language].ViewWallet.tab_list[1] && transactions.length > 0 &&
            <Button onPress={clearTransactions} mt={4} width={'full'} position={'absolute'} bottom={0} isLoading={loading}><Text>{translations[language].ViewWallet.clear_button}</Text></Button>
          }
          <MobileFooter wallet={wallet} navigation={navigation}></MobileFooter>
        </Box>
      }

      
    </DashboardLayout>
  )
}