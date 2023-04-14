/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { ethers, getDefaultProvider, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import moment from "moment";
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
import { Area, Chart, HorizontalAxis, Line, VerticalAxis } from 'react-native-responsive-linechart';
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import MobileFooter from "../../components/Footer";
import SummaryItem from "../../components/token/SummaryItem";
import TokenItem from '../../components/token/TokenItem';
import TransactionItem from "../../components/transaction/TransactionItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getWalletHistory } from "../../service/api";
import { activeNetwork, activeWallet, networkList, language as stateLanguage } from "../../service/state";
import { Transaction } from "../../service/transaction";
import { truncateString } from "../../service/utility";
import { iconNames } from '../../store/network';
import { getTokenByChain } from '../../store/token';
import { getTransactionsByChainAndWallet, storeTransactions } from '../../store/transaction';
import NftList from "../nft/NftList";
const chainName = 'matic-mainnet';

type Holding = {
  readonly timestamp: string;
  readonly quote_rate: number;
  readonly open: {
    readonly balance: number;
    readonly quote: number;
  };
  readonly high: {
    readonly balance: number;
    readonly quote: number;
  };
  readonly low: {
    readonly balance: number;
    readonly quote: number;
  };
  readonly close: {
    readonly balance: number;
    readonly quote: number;
  };
};

type Item = {
  readonly contract_decimals: number;
  readonly contract_name: string;
  readonly contract_ticker_symbol: string;
  readonly contract_address: string;
  readonly supports_erc: boolean;
  readonly logo_url: string;
  readonly holdings: readonly Holding[];
};

type JsonDataModel = {
  readonly error: string;
  readonly error_message: string;
  readonly error_code: string;
  readonly walletAddress: string;
  readonly updatedAt: string;
  readonly chainId: number;
  readonly chainName: string;
  readonly lastModified: number;
  readonly data: {
    readonly address: string;
    readonly updated_at: string;
    readonly next_update_at: string;
    readonly quote_currency: string;
    readonly chain_id: number;
    readonly chain_name: string;
    readonly items: readonly Item[];
  };
};

type OutputObject = {
  readonly openQuotesByDay: readonly {
    readonly date: string;
    readonly totalQuote: number;
  }[];
  readonly itemsWithRecentOpenQuote: readonly {
    readonly contract: {
       readonly name: string;
       readonly ticker_symbol: string;
       readonly address: string;
    };
    readonly mostRecentOpenQuote: {
      readonly balance: number;
      readonly quote: number;
    };
  }[];
};


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

export default function WalletHistory ({navigation, route}) {
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
  const [chartData, setChartData] = useState([]);
  const [openQuotes, setOpenQuotes] = useState([]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  const tabList = translations[language].ViewWallet.tab_list;

  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);
  

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    } else {
      console.log(_wallet.wallet.address);
      setWallet(_wallet.wallet);
    }

    //console.log('ViewWallet', network.chainId);
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
      
      const historyResults = await getWalletHistory(wallet.address, chainName);
      //console.log(historyResults);
      const outputData = processJsonData(historyResults);
      console.log(outputData.openQuotesByDay[0]);
      setHoldings(outputData.itemsWithRecentOpenQuote);
      
      setChartData(outputData.openQuotesByDay.map((d) => {
        return {
          meta: {
            'date': d.date
          },
          x: moment(d.date).valueOf(),
          y: d.totalQuote
        }
      }));
    }
    if (wallet.address) {
      runAsync();
    }
  }, [wallet])

  

  useEffect(() => {    
    //setHoldings([]);
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
    setChartData([]);
    
    setTimeout(async() => {
      setRefreshing(false);
    }, 100)
  }, []);

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  const processJsonData = (jsonData) => {
    const output = {
      itemsWithRecentOpenQuote: [],
      openQuotesByDay: [],
    };
  
    if (jsonData.error) {
      console.error(jsonData.error_message);
      return output;
    }
  
    jsonData.data.items.forEach((item) => {
      let mostRecentOpenQuote = null;
  
      item.holdings.forEach((holding) => {
        const date = holding.timestamp.split("T")[0];
  
        if (holding.open) {
          const existingEntry = output.openQuotesByDay.find((entry) => entry.date === date);
  
          if (existingEntry) {
            // eslint-disable-next-line functional/immutable-data
            existingEntry.totalQuote += holding.open.quote;
          } else {
            output.openQuotesByDay.push({ date, totalQuote: holding.open.quote });
          }
  
          if (!mostRecentOpenQuote || mostRecentOpenQuote.timestamp < holding.timestamp) {
            mostRecentOpenQuote = holding.open;
          }
        }
      });
  
      if (mostRecentOpenQuote) {
        output.itemsWithRecentOpenQuote.push({
          contract: {
            address: item.contract_address,
            name: item.contract_name,
            ticker_symbol: item.contract_ticker_symbol,
          },
          mostRecentOpenQuote,
        });
      }
    });
  
    return output;
  }
  

  return (
    <DashboardLayout title={_wallet.name}>
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

        { chartData.length > 0 && 
          <Box padding={0} borderRadius={10} marginX={2} >
            <Chart
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ height: 300, width: '100%' }}
              data={chartData}
              padding={{ bottom: 20, left: 0, right: 0, top: 20 }}
              yDomain={{ max: 100000, min: -5000}}
            >
              <Area theme={{ gradient: { from: { color: '#D4E815' }, to: { color: 'black', opacity: 0.4 } }}} />
            </Chart>
          </Box>
        }
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}              
            />
          }
        >
          <VStack space="5" px={2} mb={10}>
            {holdings.length > 0 &&
              <Box m={6} >
                <VStack space={2} >
                  {
                    holdings.map((val, i) => {
                      return (                        
                        <SummaryItem key={val.name+i} token={val}/>                        
                      )
                    })
                  }
                </VStack>
                
              </Box>
            }
          </VStack>
        </ScrollView>
        
        <MobileFooter wallet={wallet} navigation={navigation}></MobileFooter>
      </Box>
    </DashboardLayout>
  )
}