/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
//import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
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
import currency from "currency.js";

import translations from "../../assets/translations";
import MobileFooter from "../../components/ui/Footer";
import SummaryItem from "../../components/token/SummaryItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getWalletHistory } from "../../service/api";
import { chainIdToNameMap, chainNames } from "../../service/constants";
import { activeNetwork, activeWallet, language as stateLanguage } from "../../service/state";
import { ChartData, ExtendedBalance, Holding, ItemsWithOpenQuote, OpenQuotes, OutputObject } from "../../types/history";
import { WalletInternal } from "../../store/wallet";
import { processCovalentJsonData } from "../../service/utility";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import TransactionFeed from "../../components/transaction/TransactionFeed";
import { useIsFocused } from "@react-navigation/native";
import { getActiveNetwork } from "../../store/network";
import { Color } from "../../../GlobalStyles";
import { useMixpanel } from "../../hooks/useMixpanel";
import { useConversionRate } from "../../hooks/useConversionRate";
dayjs.extend(customParseFormat);

export default function WalletHistory({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const { conversionRate } = useConversionRate();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [chainName, setChainName] = useState('matic-mumbai');
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const mixpanel = useMixpanel();
  //const [network,] = useRecoilState(activeNetwork);
  const [currentHoldings, setCurrentHoldings] = useState({
    meta: {
      'date': '01/01/2024'
    },
    x: 0,
    y: 0
  } as ChartData);
  //const [holdings, setHoldings] = useState([] as ItemsWithOpenQuote[]);
  const [chartData, setChartData] = useState([] as ChartData[]);
  const [isZeroData, setIsZeroData] = useState(false);
  //const conversionRate = 1;
  //const currency = 'USD';

  const getData = async () => {
    try {
      setRefreshing(true);
      const _network = await getActiveNetwork();
      const chainName = chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap];
      const historyResults = await getWalletHistory(wallet.address, chainName);
      const { quotes: finalQuotes, isReady } = processCovalentJsonData(historyResults, null);
      //const finalQuotes = result.quotes;
      if (finalQuotes.length > 0) {
        const quoteMap = finalQuotes.sort((a, b) => a.x - b.x).reduce((returnVal, d) => {
          if (returnVal[d.x]) {
            return { ...returnVal, [d.x]: { ...returnVal[d.x], y: returnVal[d.x].y + d.y } }
          }
          return { ...returnVal, [d.x]: d };
        }, {} as { [key: number]: ChartData });
        const _quotes = Object.values(quoteMap);
        setCurrentHoldings(_quotes[_quotes.length - 1]);
        setIsZeroData(isReady);

        if (_quotes.length > 7) {
          setChartData(_quotes.reverse().splice(0, 7));
        } else {
          setChartData(_quotes.reverse());
        }

      }
      setRefreshing(false);
    } catch (err: any) {
      //const err2 = err as Error;
    }
  }

  useEffect(() => {
    if (_wallet.name !== '') {
      setWallet(new WalletInternal(_wallet.wallet));
    }
  }, [_wallet]);

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      try {
        if (isMounted) setRefreshing(true);
        const _network = await getActiveNetwork();
        const chainName = chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap];
        const historyResults = await getWalletHistory(wallet.address, chainName);
        const { quotes: finalQuotes, isReady } = processCovalentJsonData(historyResults, null);
        //const finalQuotes = result.quotes;
        if (finalQuotes.length > 0) {
          const quoteMap = finalQuotes.sort((a, b) => a.x - b.x).reduce((returnVal, d) => {
            if (returnVal[d.x]) {
              return { ...returnVal, [d.x]: { ...returnVal[d.x], y: returnVal[d.x].y + d.y } }
            }
            return { ...returnVal, [d.x]: d };
          }, {} as { [key: number]: ChartData });
          const _quotes = Object.values(quoteMap);
          if (isMounted) setCurrentHoldings(_quotes[_quotes.length - 1]);
          if (isMounted) setIsZeroData(isReady);

          if (_quotes.length > 7) {
            if (isMounted) setChartData(_quotes.reverse().splice(0, 7));
          } else {
            if (isMounted) setChartData(_quotes.reverse());
          }

        }
        if (isMounted) setRefreshing(false);
      } catch (err: any) {
        //const err2 = err as Error;
      }
    }
    if (wallet.address) {
      //setRefreshing(true);
      runAsync();
    }
    return () => { isMounted = false; }
  }, [wallet])

  useEffect(() => {
    const runAsync = async () => {
      await mixpanel.track("view_page", { "page": "Wallet History" });
    }
    runAsync();
  }, [])

  const empty = () => {
    //console.log('empty');
  }
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    //setHoldings([]);
    //setChartData([]);
    //getData();
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

  const convertedValue = () => {
    if (currentHoldings && currentHoldings.y) {
      if (conversionRate && conversionRate.value) {
        const _convertedValue = currentHoldings.y * conversionRate.value;
        return currency(_convertedValue, { precision: 2, symbol: CURRENCY_SYMBOLS[conversionRate.currency as keyof typeof CURRENCY_SYMBOLS] }).format();
      }
      return currency(currentHoldings.y, { precision: 2 }).format();
    }
    return currency(0, { precision: 2 }).format();
  }

  const tooltipValue = (y: number) => {
    if (y) {
      if (conversionRate && conversionRate.value) {
        const _convertedValue = y * conversionRate.value;
        return currency(_convertedValue, { precision: 2, symbol: CURRENCY_SYMBOLS[conversionRate.currency as keyof typeof CURRENCY_SYMBOLS] }).format();
      }
      return currency(y, { precision: 2 }).format();
    }
    return currency(0, { precision: 2 }).format();
  }
  return (
    <DashboardLayout title={_wallet.name}>
      <VStack
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
                  <Heading borderBottomColor={colorMode === 'dark' ? 'primary' : 'purple.500'} borderBottomWidth={2}><Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} >{convertedValue()}</Text></Heading>
                </HStack>
              </VStack>

            </HStack>

            <Chart
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ minHeight: 250, width: '100%' }}
              data={chartData}
              yDomain={isZeroData ? { max: 20, min: -20 } : { max: getMaxValue(), min: 0 }}
              padding={{ bottom: 20, left: 15, right: 15, top: 50 }}
            >
              <HorizontalAxis tickCount={7} tickValues={chartData.map((v) => v.x)} theme={{
                labels: {
                  visible: true,
                  label: {
                    color: colorMode === 'dark' ? Color.white : Color.black,
                    fontSize: 12,
                  },
                  formatter: (v) => dayjs(v, 'X').format('ddd')
                  //formatter?: (value: number) => string;
                },
                grid: {
                  visible: true,
                  stroke: {
                    color: '#ccc',
                    width: 1,
                    opacity: 1,
                    dashArray: [5, 5]
                  },
                },
              }} />
              <Area smoothing={'bezier'} theme={{ gradient: { from: { color: colorMode === 'dark' ? '#D4E815' : '#6b21a8' }, to: { color: colorMode === 'dark' ? 'black' : 'white', opacity: 0.4 } } }} />
              <Line
                tooltipComponent={
                  <Tooltip theme={{
                    formatter: (value) => {
                      return tooltipValue(value.y)
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
                smoothing={'bezier'}
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
        {
          <TransactionFeed navigation={navigation} tokenAddress={null} updateDefault={empty} />
        }
        {/*<MobileFooter navigation={navigation}></MobileFooter>*/}
      </VStack>
    </DashboardLayout>
  )
}