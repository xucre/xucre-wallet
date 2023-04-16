/* eslint-disable functional/immutable-data */
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
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { Area, Chart, HorizontalAxis, Line, Tooltip, VerticalAxis } from 'react-native-responsive-linechart';
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

export default function WalletHistory({ navigation, route }) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [chainName, setChainName] = useState('matic-mumbai');
  const handleNameChange = (event) => {
    //console.log(event.nativeEvent.text);
    setChainName(event.nativeEvent.text)
  }
  const [currentTab, setCurrentTab] = useState(translations[language].ViewWallet.tab_list[0]);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [network,] = useRecoilState(activeNetwork);
  const [networks, setAllNetworks] = useRecoilState(networkList);
  const [currentHoldings, setCurrentHoldings] = useState({
    y: '0.00'
  });
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

  const getData = async () => {

    const historyResults = await getWalletHistory(wallet.address, chainName);
    //console.log(historyResults);
    console.log('hsitory retrieved');
    const outputData = processJsonData(historyResults);
    //console.log(outputData)
    //console.log(outputData.openQuotesByDay[0]);

    // ONLY FOR TESTING - USED TO FILL CHART VALUES WHEN ALL ARE EMPTY
    const isReady = outputData.openQuotesByDay[0].totalQuote === null || outputData.openQuotesByDay[0].totalQuote === 0;
    const openQuotes = outputData.openQuotesByDay.reduce((finalVal, d, i) => {
      if (isReady) {
        if (i === 0) {
          return {
            direction: finalVal.direction,
            quotes: [...finalVal.quotes, {
              date: d.date,
              totalQuote: 14555.36
            }]
          }
        }
        const upAmount = i > 0 ? (finalVal.quotes[i-1].totalQuote + (Math.random()*1500)) : 11255.32;
        const downAmount = i > 0 ? (finalVal.quotes[i-1].totalQuote - (Math.random()*1500)) : 12655.53;
        const changeCourse = (upAmount < 300000 && finalVal.direction === 'up') || (downAmount < 10000 && finalVal.direction === 'down');
        const direction = !changeCourse ? finalVal.direction : finalVal.direction === 'up' ? 'down' : 'up';
        return {
          direction,
          quotes: [...finalVal.quotes, {
            date: d.date,
            totalQuote: direction === 'up' ? upAmount : downAmount
          }]
        }
      }

      return  {
        direction: finalVal.direction, 
        quotes: [...finalVal.quotes, d]
      };
    }, {
      direction: 'down',
      quotes: []
    })
    console.log(openQuotes.quotes.length);
    // END TESTING PORTION
    setHoldings(outputData.itemsWithRecentOpenQuote);
    const finalQuotes = openQuotes.quotes.map((d) => {
      return {
        meta: {
          'date': d.date
        },
        x: moment(d.date).unix(),
        y: Math.round((d.totalQuote + Number.EPSILON) * 100) / 100
      }
    });
    setCurrentHoldings(finalQuotes[0])
    setChartData(finalQuotes);
  }

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
    if (wallet.address) {
      setHoldings([]);
      setCurrentHoldings({
        y: '0.00'
      });
      setChartData([]);
      getData();
    }
  }, [wallet, chainName])



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

    setTimeout(async () => {
      setRefreshing(false);
    }, 100)
  }, []);

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  const processJsonData = (jsonData) => {
    const output = {
      isTokenValue: false,
      itemsWithRecentOpenQuote: [],
      openQuotesByDay: [],
    };

    if (jsonData.error) {
      //console.error(jsonData.error_message);
      return output;
    }

    jsonData.data.items.forEach((item) => {
      let mostRecentOpenQuote = null;

      item.holdings.forEach((holding) => {
        const date = holding.timestamp.split("T")[0];

        if (holding.open) {
          const existingEntry = output.openQuotesByDay.find((entry) => entry.date === date);

          if (existingEntry) {
            existingEntry.totalQuote += holding.open.quote;
            existingEntry.quoteRate = holding.quote_rate;
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

        {chartData.length > 0 &&
          <Box padding={0} borderRadius={10} marginX={2} >
            <HStack space={2} justifyContent={'space-between'}>
              <VStack>
                <Text fontSize={'md'} fontWeight={'bold'} color={'coolGray.500'} paddingTop={3}>Total Balance</Text>
                <HStack paddingBottom={0} space={1}>
                  <Heading borderBottomColor={'#D4E815'} borderBottomWidth={2}><Text fontSize={'3xl'} fontWeight={'bold'} color={'coolGray.100'} >${currentHoldings.y}</Text></Heading>              
                </HStack>  
              </VStack>
              <Menu w="160" shouldOverlapWithTrigger={false} trigger={triggerProps => {
                  return <Button alignSelf="center" variant="ghost" color={'coolGray.300'} marginTop={-1} endIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" size="md" color={'coolGray.300'} marginLeft={-1} />} {...triggerProps}>
                          <Text color={'coolGray.300'} fontWeight={'bold'}>{chainName}</Text>
                        </Button>
                        ;
                }}>
                    <Menu.Item onPress={() => {setChainName('matic-mumbai')}}><Text>matic-mumbai</Text></Menu.Item>
                    <Menu.Item onPress={() => {setChainName('matic-mainnet')}}><Text>matic-mainnet</Text></Menu.Item>
                    <Menu.Item onPress={() => {setChainName('eth-mainnet')}}><Text>eth-mainnet</Text></Menu.Item>
                  </Menu>
              
            </HStack>
            
            <Chart
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ height: 300, width: '100%' }}
              data={chartData}
              padding={{ bottom: 20, left: 10, right: 10, top: 50 }}
            >
              <HorizontalAxis />
              <Area theme={{ gradient: { from: { color: '#D4E815' }, to: { color: 'black', opacity: 0.4 } } }} />
              <Line
                tooltipComponent={
                  <Tooltip theme={{                   
                    formatter: (value) => {
                      return '$'+ value.y
                    },
                    label: {
                      color: 'black',
                      textAnchor: 'middle',
                    },
                    shape: {
                      color: '#D4E815',
                      dx: 0,
                      dy: 20,
                      height: 24,
                      rx: 4,
                      width: 85,
                    }, 
                  }} />
                }
                smoothing={'cubic-spline'}
                theme={{
                  scatter: { 
                    default: { 
                      color: '#E1F245',
                      height: 0, 
                      rx: 4, 
                      width: 0, 
                    }, 
                    selected: {
                      color: 'white',
                    }
                  },
                  stroke: { 
                    color: '#E1F245', 
                    width: 1 
                  }, 
                }}
              />
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
                        <SummaryItem key={val.name + i} token={val} />
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