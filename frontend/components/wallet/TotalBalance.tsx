/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { ethers, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
//import moment from "moment";
import daysjs from 'dayjs';
import {
  Badge,
  Box,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { getWalletHistory } from "../../service/api";
import { chainIdToNameMap } from "../../service/constants";
import { activeNetwork, activeWallet, networkList, language as stateLanguage } from "../../service/state";
import { ChartData, ExtendedBalance, Holding, OpenQuotes, OutputObject } from "../../types/history";
import { WalletInternal } from "../../store/wallet";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import { processCovalentJsonData } from "../../service/utility";
import { useIsFocused } from '@react-navigation/native';
import dayjs from "dayjs";
import { getActiveNetwork } from "../../store/network";
import NetworkIcon from "../utils/NetworkIcon";

export default function TotalBalance({ navigate }: { navigate: Function }) {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [network,] = useRecoilState(activeNetwork);
  const [networks, setAllNetworks] = useRecoilState(networkList);
  const chainName = chainIdToNameMap[network.chainId as keyof typeof chainIdToNameMap] || 1;
  const conversionRate = 1;
  const currency = 'USD';
  const [currentHoldings, setCurrentHoldings] = useState({
    x: 0,
    y: 0
  });
  const [secondToLastHoldings, setSecondToLastHoldings] = useState({
    percent: '0%',
    trend: 'flat',
    y: '0.00',
  })

  const emptyFunction = () => { };
  const emptyNavigation = { navigate: emptyFunction };
  useEffect(() => {
    if (_wallet.name !== '' && network) {
      setWallet(new WalletInternal(_wallet.wallet));
    }
  }, [_wallet, network]);

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const _network = await getActiveNetwork();
        const chainName = chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap];
        const historyResults = await getWalletHistory(wallet.address, chainName);
        const { openQuotes: _finalQuotes, isReady } = processCovalentJsonData(historyResults, null);
        if (_finalQuotes && _finalQuotes.quotes.length > 0) {
          const finalQuotes = _finalQuotes.quotes;
          const quoteMap = finalQuotes.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1).reduce((returnVal, d) => {
            if (returnVal[d.date]) {
              if (!d.isTokenValue) {
                return { ...returnVal, [d.date]: { ...returnVal[d.date], y: returnVal[d.date].y + d.totalQuote } }
              }
              return returnVal;
            }
            if (!d.isTokenValue) {
              return { ...returnVal, [d.date]: { x: dayjs(d.date).unix(), y: d.totalQuote } };
            }
            return returnVal;
          }, {} as { [key: string]: { x: number, y: number } });
          const _quotes = Object.values(quoteMap);
          const lastQuote = _quotes[_quotes.length - 1];
          if (isMounted) setCurrentHoldings(lastQuote);
          const secondToLastQuote = _quotes[_quotes.length - 2];
          const percent = (((secondToLastQuote.y - lastQuote.y) / _quotes[0].y) || 0).toFixed(0) + '%';
          const trend = secondToLastQuote.y > lastQuote.y ? 'up' : secondToLastQuote.y < lastQuote.y ? 'down' : 'flat';
          const y = (secondToLastQuote.y - lastQuote.y).toFixed(2);
          if (isMounted) setSecondToLastHoldings({ percent, trend, y: y || '' })
        }
      } catch (err: any) {
        //const err2 = err as Error;
      }
    }
    if (wallet.address && isFocused) {
      getData();
    }
    return () => { isMounted = false }
  }, [wallet, chainName, isFocused])

  const formatCurrency = (amount: string) => {
    return Number.parseFloat(amount).toFixed(2);
  }

  return (
    <Box
      _light={{ backgroundColor: 'white' }}
      _dark={{ backgroundColor: 'black' }}
      my={4}
    >
      <Pressable onPress={() => navigate('WalletHistory')}>
        {
          <Box bg={colorMode === 'dark' ? "primary.600" : "tertiary.500"} padding={3} borderRadius={10} marginX={2} >

            <Text fontSize={'md'} fontWeight={'bold'} color={colorMode === 'dark' ? "darkText" : "lightText"} paddingTop={3}>{translations[language as keyof typeof translations].totalBalance.title}</Text>

            <HStack paddingBottom={0} space={1} alignItems={'center'}>
              <Heading ><Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? "darkText" : "lightText"} >{CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]}{currentHoldings ? formatCurrency(currentHoldings.y.toString()) : '0.00'}</Text></Heading>
              <NetworkIcon navigation={emptyNavigation} isInline={true} close={emptyFunction} />
              {/*<Text color={colorMode === 'dark' ? "darkText" : "lightText"} fontWeight={'bold'}>{chainName}</Text>*/}

            </HStack>

            <Badge rounded={10} variant={'solid'} backgroundColor={colorMode === 'dark' ? "black" : "primary.500"} width={'2/5'} marginTop={2}>
              <HStack paddingY={1} alignItems={'center'}>
                {secondToLastHoldings.trend === 'up' &&
                  <Icon as={MaterialIcons} name="trending-up" color={colorMode === 'dark' ? "primary.500" : "darkText"} size={'sm'} marginRight={1.5} />
                }
                {secondToLastHoldings.trend === 'flat' &&
                  <Icon as={MaterialIcons} name="trending-flat" color={colorMode === 'dark' ? "primary.500" : "darkText"} size={'sm'} marginRight={1.5} />
                }
                {secondToLastHoldings.trend === 'down' &&
                  <Icon as={MaterialIcons} name="trending-down" color={colorMode === 'dark' ? "primary.500" : "darkText"} size={'sm'} marginRight={1.5} />
                }
                <Text textAlign={'left'} color={colorMode === 'dark' ? 'white' : 'black'} marginRight={1.5}>${formatCurrency(secondToLastHoldings.y)}</Text>
                <Text textAlign={'left'} color={'coolGray.500'}>{`(${secondToLastHoldings.percent})`}</Text>
              </HStack>

            </Badge>
          </Box>
        }
      </Pressable>
    </Box>
  )
}