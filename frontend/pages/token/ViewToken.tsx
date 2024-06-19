/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { ethers, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
//import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Menu,
  Pressable,
  ScrollView,
  Skeleton,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Area, Chart, HorizontalAxis, Line, Tooltip } from 'react-native-responsive-linechart';
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import MobileFooter from "../../components/ui/Footer";
import SummaryItem from "../../components/token/SummaryItem";
import DashboardLayout from '../../layouts/DashboardLayout';
import { getWalletHistory } from "../../service/api";
import { chainIdToNameMap, chainNames } from "../../service/constants";
import { activeNetwork, activeWallet, language as stateLanguage } from "../../service/state";
import { ChartData, ExtendedBalance, Holding, ItemsWithOpenQuote, OpenQuotes, OutputObject } from "../../types/history";
import { WalletInternal } from "../../store/wallet";
import { isSVGFormatImage, processCovalentJsonData, truncateString_old } from "../../service/utility";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import TransactionFeed from "../../components/transaction/TransactionFeed";
import { useIsFocused } from "@react-navigation/native";
import { coinIconNames, getActiveNetwork, tokenIconNames } from "../../store/network";
import { Color } from "../../../GlobalStyles";
import TokenTransactionFeed from "../../components/transaction/TokenTransactionFeed";
import { SvgUri } from "react-native-svg";
import { useMixpanel } from "../../hooks/useMixpanel";
import { SerializedToken } from "../../service/token";
dayjs.extend(customParseFormat);

export default function ViewToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const mixpanel = useMixpanel();
  const token = route.params?.token as SerializedToken;
  const [avatar, setAvatar] = useState('');
  const isFocused = useIsFocused();
  const [showUsd, setShowUsd] = useState(true);
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const empty = () => { }
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
  const [isChartDataRaw, setIsChartDataRaw] = useState(false);
  const conversionRate = 1;
  const currency = 'USD';
  useEffect(() => {
    const runAsync = async () => {
      await mixpanel.track("view_page", { "page": "View Token" });
    }
    if (token.chainId && token.type === 'coin' && coinIconNames[token.chainId as keyof typeof coinIconNames]) {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + coinIconNames[token.chainId as keyof typeof coinIconNames].toLowerCase() + '.png');
    } else if (token.chainId && token.type === 'token' && tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames]) {
      setAvatar('https://xucre-public.s3.sa-east-1.amazonaws.com/' + tokenIconNames[(token.chainId + '-' + token.address.toLowerCase()) as keyof typeof tokenIconNames].toLowerCase() + '.png');
    }
    runAsync();
  }, []);

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    } else {
      setWallet(new WalletInternal(_wallet.wallet));
    }
  }, [_wallet]);

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      try {
        if (isMounted) setRefreshing(true);
        const chainName = chainIdToNameMap[token.chainId as keyof typeof chainIdToNameMap];
        const historyResults = await getWalletHistory(wallet.address, chainName);

        const { quotes: finalQuotes, isReady, isTokenValue } = processCovalentJsonData(historyResults, token.address);
        if (finalQuotes.length > 0) {
          if (isMounted) setIsChartDataRaw(isTokenValue as boolean)

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
        //console.log(err);
        //const err2 = err as Error;
      }
    }
    if (wallet.address) {
      //setRefreshing(true);
      runAsync();
    }
    return () => { isMounted = false }
  }, [wallet])

  const CustomIcon = ({ data, size }: { data: any, size: number }): JSX.Element => {
    return <SvgUri
      width={size}
      height={size}
      uri={data}
    />
  }

  const TokenIcon = ({ iname }: { iname: string }) => {
    const icon_color = colorMode === 'dark' ? 'white' : 'black';
    //const _img = alchemyMetadata.logo || token.logo || avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png';
    const _img = token.logo || avatar || 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png';
    try {
      const isSvg = isSVGFormatImage(_img);
      return (
        <>
          {loading &&
            <Skeleton rounded={'full'} size={10} fadeDuration={1} />
          }
          {isSvg &&
            <Avatar _image={{ onLoadEnd: () => { setLoading(false) } }} style={{ "display": loading ? 'none' : 'flex' }} bg="transparent" mr="1" size={10}>
              <CustomIcon data={_img} size={40} />
            </Avatar>
          }
          {!isSvg &&
            <Avatar _image={{ onLoadEnd: () => { setLoading(false) } }} style={{ "display": loading ? 'none' : 'flex' }} bg="transparent" mr="1" source={{
              uri: _img
            }} size={10}>
              <Text>{iname}</Text>
            </Avatar>
          }
        </>


        //<Icon name="poly" style={{ alignSelf: 'center', color: icon_color, fontSize: 25, justifyContent: 'center',marginBottom:0, marginTop:-100,  }}/>
      )
    } catch {
      return <Avatar _image={{ onLoadEnd: () => { setLoading(false) } }} style={{ "display": loading ? 'none' : 'flex' }} bg="transparent" mr="1" source={{
        uri: 'https://xucre-public.s3.sa-east-1.amazonaws.com/icon-gray.png'
      }} size={10}>
        <Text>{iname}</Text>
      </Avatar>
    }

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

  const flipShowUsd = () => {
    setShowUsd(!showUsd);
  }

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

  const computedSymbol = (token.symbol || token.name || 'N/A');


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
            <HStack space={2} justifyContent={'space-between'} alignItems={'center'}>
              <HStack alignItems={'center'}>
                <TokenIcon iname={token.type == 'coin' ? coinIconNames[token.chainId as keyof typeof coinIconNames] : truncateString_old(token.address, 3) as string} />
                <VStack space={0} >
                  <Text fontSize={'2xl'} mb={-1} fontWeight={'bold'} color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'}>{token.name}</Text>
                  <Text fontSize={'md'} color={colorMode === 'dark' ? 'coolGray.400' : 'dark.300'} >{computedSymbol}</Text>
                </VStack>
              </HStack>
              <Pressable onPress={flipShowUsd}>
                <VStack>
                  <Text fontSize={'md'} justifyContent={'flex-end'} alignItems={'flex-end'} color={colorMode === 'dark' ? 'coolGray.400' : 'dark.300'} paddingTop={3} >{showUsd && !isChartDataRaw ? translations[language as keyof typeof translations].ViewToken.current_price : translations[language as keyof typeof translations].ViewToken.current_balance}</Text>
                  <HStack paddingBottom={0} space={1} justifyContent={'flex-end'} alignItems={'flex-end'} >
                    <Heading textAlign={'right'} borderBottomColor={colorMode === 'dark' ? 'primary' : 'purple.500'} alignContent={'flex-end'} justifyContent={'flex-end'} borderBottomWidth={2}>
                      <Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? 'coolGray.100' : 'dark.300'} textAlign={'right'} alignContent={'flex-end'}>
                        {showUsd && !isChartDataRaw ? CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] + (currentHoldings ? currentHoldings.y.toFixed(2) : '0.00') : truncateString_old(ethers.utils.formatUnits(token.amount as string, token.decimals), 11, false)}
                      </Text>
                    </Heading>
                  </HStack>
                </VStack>
              </Pressable>
            </HStack>

            {

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
                        return !isChartDataRaw ? CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] : '' + value.y
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
            }
          </Box>
        }
        {token.address && ethers.utils.getAddress(token.address) !== ethers.constants.AddressZero &&
          <TokenTransactionFeed navigation={navigation} tokenAddress={token.address} chainId={token.chainId} />
        }

        {token.address && ethers.utils.getAddress(token.address) === ethers.constants.AddressZero &&
          <TransactionFeed navigation={navigation} tokenAddress={null} updateDefault={empty} chainId={token.chainId} />
        }
      </Box>
    </DashboardLayout>
  )
}