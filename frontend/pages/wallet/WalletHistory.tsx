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
import { chainIdToNameMap, chainNames } from "../../service/constants";
import { activeNetwork, activeWallet, language as stateLanguage } from "../../service/state";
import { ChartData, ExtendedBalance, Holding, ItemsWithOpenQuote, OpenQuotes, OutputObject } from "../../types/history";
import { WalletInternal } from "../../store/wallet";
import { processJsonData } from "../../service/utility";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import TransactionFeed from "../../components/transaction/TransactionFeed";
import { useIsFocused } from "@react-navigation/native";
import { getActiveNetwork } from "../../store/network";


export default function WalletHistory({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [chainName, setChainName] = useState('matic-mumbai');
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  //const [network,] = useRecoilState(activeNetwork);
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
  const conversionRate = 1;
  const currency = 'USD';
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused && wallet.address) {
      //onRefresh();
    }
  }, [isFocused])

  const getData = async () => {
    try {
      const _network = await getActiveNetwork();
      const chainName = chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap];
      const historyResults = await getWalletHistory(wallet.address, chainName);
      const outputData = processJsonData(historyResults);
      const isReady = outputData === null || outputData.openQuotesByDay[0].totalQuote === null || outputData.openQuotesByDay[0].totalQuote === 0;
      const openQuotes = outputData.openQuotesByDay.reduce((finalVal, d, _i) => {
        return {
          ...finalVal,
          quotes: [...finalVal.quotes, d]
        } as OpenQuotes;
      }, {
        direction: 'down',
        quotes: []
      } as OpenQuotes);

      setHoldings(outputData.itemsWithRecentOpenQuote);
      const finalQuotes = openQuotes.quotes.map((d) => {
        return {
          meta: {
            'date': d.date
          },
          x: moment(d.date).unix(),
          y: Math.round(((d.totalQuote * conversionRate) + Number.EPSILON) * 100) / 100
        }
      });
      setCurrentHoldings(finalQuotes[0]);
      setChartData(finalQuotes);
      setIsZeroData(isReady);
      setRefreshing(false);

    } catch (err) {
      setTimeout(() => {
        //getData();
      }, 1000)

    }
  }

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    } else {
      setWallet(new WalletInternal(_wallet.wallet));
    }
  }, [_wallet]);

  useEffect(() => {
    if (wallet.address) {
      setRefreshing(true);
      getData();
    }
  }, [])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //setHoldings([]);
    //setChartData([]);
    getData();
    /*setTimeout(async () => {
      setRefreshing(false);
    }, 100)*/
  }, []);

  //\\\const walletTotal = currentHoldings ? currentHoldings.y : '0.00';

  const getMaxValue = () => {
    const result = chartData.reduce((retVal, chart) => {
      if (retVal < chart.y) {
        return chart.y;
      }
      return retVal;
    }, 0);
    return result;
  }
  return (
    <DashboardLayout title={_wallet.name}>
      <Box
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: 'black' }}
        height={'full'}
        safeAreaBottom
      >

        {chartData.length > 0 &&
          <Box padding={0} borderRadius={10} marginX={2} >
            <HStack space={2} justifyContent={'space-between'}>
              <VStack>
                <Text fontSize={'md'} fontWeight={'bold'} color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} paddingTop={3} >{translations[language as keyof typeof translations].WalletHistory.total_balance}</Text>
                <HStack paddingBottom={0} space={1}>
                  <Heading borderBottomColor={colorMode === 'dark' ? 'primary' : 'purple.500'} borderBottomWidth={2}><Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} >{CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]}{currentHoldings ? currentHoldings.y.toFixed(2) : '0.00'}</Text></Heading>
                </HStack>
              </VStack>

            </HStack>

            <Chart
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ minHeight: 150, width: '100%' }}
              data={chartData}
              yDomain={isZeroData ? { max: 20, min: -20 } : { max: getMaxValue(), min: 0 }}
              padding={{ bottom: 20, left: 10, right: 10, top: 50 }}
            >
              <HorizontalAxis />
              <Area theme={{ gradient: { from: { color: colorMode === 'dark' ? '#D4E815' : '#6b21a8' }, to: { color: colorMode === 'dark' ? 'black' : 'white', opacity: 0.4 } } }} />
              <Line
                tooltipComponent={
                  <Tooltip theme={{
                    formatter: (value) => {
                      return CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] + value.y
                    },
                    label: {
                      color: colorMode === 'dark' ? 'black' : 'white',
                      textAnchor: 'middle',
                    },
                    shape: {
                      color: colorMode === 'dark' ? '#D4E815' : '#6b21a8',
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
        <TransactionFeed navigation={navigation} />

        <MobileFooter navigation={navigation}></MobileFooter>
      </Box>
    </DashboardLayout>
  )
}