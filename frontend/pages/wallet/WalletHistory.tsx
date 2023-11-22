/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import moment from "moment";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Menu,
  Pressable,
  ScrollView,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Area, Chart, HorizontalAxis, Line, Tooltip } from 'react-native-responsive-linechart';
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import MobileFooter from "../../components/Footer";
import SummaryItem from "../../components/token/SummaryItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getWalletHistory } from "../../service/api";
import { chainNames } from "../../service/constants";
import { activeNetwork, activeWallet, language as stateLanguage } from "../../service/state";
import { ChartData, ExtendedBalance, Holding, ItemsWithOpenQuote, OpenQuotes, OutputObject } from "../../types/history";
import { WalletInternal } from "../../store/wallet";


export default function WalletHistory({ navigation, route }: {navigation: {navigate: Function}, route: any}) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [chainName, setChainName] = useState('matic-mumbai');
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [network,] = useRecoilState(activeNetwork);
  const [currentHoldings, setCurrentHoldings] = useState({
    meta: {
      'date': ''
    },
    x: 0,
    y: 0
  } as ChartData);
  const [holdings, setHoldings] = useState([] as ItemsWithOpenQuote[]);
  const [chartData, setChartData] = useState([] as ChartData[]);
  const [isZeroData, setIsZeroData] = useState(false);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  const tabList = translations[language as keyof typeof translations].ViewWallet.tab_list;

  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);

  const getData = async () => {

    const historyResults = await getWalletHistory(wallet.address, chainName);
    const outputData : OutputObject = processJsonData(historyResults);

    // ONLY FOR TESTING - USED TO FILL CHART VALUES WHEN ALL ARE EMPTY
    const isReady = outputData === null || outputData.openQuotesByDay[0].totalQuote === null || outputData.openQuotesByDay[0].totalQuote === 0;
    const openQuotes = outputData.openQuotesByDay.reduce((finalVal, d, i) => {
      return  {
        direction: 'down', 
        quotes: [...finalVal.quotes, d]
      };
    }, {} as OpenQuotes)
    // END TESTING PORTION
    setHoldings(outputData.itemsWithRecentOpenQuote);
    const finalQuotes : ChartData[] = openQuotes.quotes.map((d) => {
      return {
        meta: {
          'date': d.date
        },
        x: moment(d.date).unix(),
        y: Math.round((d.totalQuote + Number.EPSILON) * 100) / 100
      }
    });
    setCurrentHoldings(finalQuotes[0] || {
      meta: {
        'date': ''
      },
      x: 0,
      y: 0
    })
    setChartData(finalQuotes);
    setIsZeroData(isReady);
    setRefreshing(false);
  }

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    } else {
      setWallet(new WalletInternal(_wallet.wallet));
    }
  }, [_wallet, network]);

  useEffect(() => {
    if (wallet.address) {
      setHoldings([]);
      setCurrentHoldings({
        meta: {
          'date': ''
        },
        x: 0,
        y: 0
      });
      setChartData([]);
      setRefreshing(true);
      getData();
    }
  }, [wallet, chainName])



  useEffect(() => {
    //setHoldings([]);
  }, [])

  const copyToClipboard = () => {
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
    getData();
    /*setTimeout(async () => {
      setRefreshing(false);
    }, 100)*/
  }, []);

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

  const processJsonData = (jsonData: { error: any; data: { items: any[]; }; } | null) => {
    const output : OutputObject = {
      isTokenValue: false,
      itemsWithRecentOpenQuote: [],
      openQuotesByDay: [],
    };

    if (jsonData === null || jsonData.error) {
      return output;
    }

    jsonData.data.items.forEach((item) => {
      let mostRecentOpenQuote: ExtendedBalance | null = null;

      item.holdings.forEach((holding: Holding) => {
        const date = holding.timestamp.split("T")[0];

        if (holding.open) {
          const existingEntry = output.openQuotesByDay.find((entry) => entry.date === date);

          if (existingEntry) {
            existingEntry.totalQuote += holding.open.quote;
            existingEntry.quoteRate = holding.quote_rate;
          } else {
            output.openQuotesByDay.push({
              date, totalQuote: holding.open.quote,
              quoteRate: undefined
            });
          }

          if (!mostRecentOpenQuote || mostRecentOpenQuote.timestamp as number < parseFloat(holding.timestamp)) {
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

  const getMaxValue = () => {
    return chartData.reduce((retVal, chart) => {
      if (retVal < chart.y) {
        return chart.y+10;
      }
      return retVal;
    }, 0)
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
                <Text fontSize={'md'} fontWeight={'bold'} color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} paddingTop={3} >Total Balance</Text>
                <HStack paddingBottom={0} space={1}>
                  <Heading borderBottomColor={colorMode === 'dark' ? 'primary' : 'purple.500'} borderBottomWidth={2}><Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} >${currentHoldings ? currentHoldings.y : '0.00'}</Text></Heading>              
                </HStack>  
              </VStack>
              <Menu w="160" shouldOverlapWithTrigger={false} trigger={triggerProps => {
                  return <Button alignSelf="center" variant="ghost" color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} marginTop={-1} endIcon={<Icon as={MaterialIcons} name="keyboard-arrow-down" size="md" color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} marginLeft={-1} />} {...triggerProps}>
                          <Text color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} fontWeight={'bold'}>{chainName}</Text>
                        </Button>
                        ;
                }}>
                    {
                      chainNames.map((cname, i) => {
                        return (
                          <Menu.Item onPress={() => {setChainName(cname)}} key={cname+i}><Text>{cname}</Text></Menu.Item>
                        )
                      })
                    }
                  </Menu>
              
            </HStack>
            
            <Chart
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ height: 300, width: '100%' }}
              data={chartData}
              yDomain={isZeroData ? { max: 20, min: -20 } : {max: getMaxValue(), min : 0}}
              padding={{ bottom: 20, left: 10, right: 10, top: 50 }}
            >
              <HorizontalAxis />
              <Area theme={{ gradient: { from: { color: colorMode === 'dark' ? 'primary' : '#6b21a8' }, to: { color: colorMode === 'dark' ? 'black' : 'white', opacity: 0.4 } } }} />
              <Line
                tooltipComponent={
                  <Tooltip theme={{                   
                    formatter: (value) => {
                      return '$'+ value.y
                    },
                    label: {
                      color: colorMode === 'dark' ? 'black' : 'white',
                      textAnchor: 'middle',
                    },
                    shape: {
                      color: colorMode === 'dark' ? 'primary' : '#6b21a8',
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
                      color: colorMode === 'dark' ? '#E1F245' : '#6b21a8',
                      height: 0, 
                      rx: 4, 
                      width: 0, 
                    }, 
                    selected: {
                      color: 'white',
                    }
                  },
                  stroke: { 
                    color: colorMode === 'dark' ? '#E1F245' : '#6b21a8', 
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
                        <SummaryItem key={'val.name' + i} token={val} />
                      )
                    })
                  }
                </VStack>

              </Box>
            }
          </VStack>
        </ScrollView>

        <MobileFooter navigation={navigation}></MobileFooter>
      </Box>
    </DashboardLayout>
  )
}