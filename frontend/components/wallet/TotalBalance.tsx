/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { MaterialIcons } from "@expo/vector-icons";
import { ethers, Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import moment from "moment";
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
import { ExtendedBalance, Holding, OpenQuotes, OutputObject } from "../../types/history";
import { WalletInternal } from "../../store/wallet";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";
import { processJsonData } from "../../service/utility";

export default function TotalBalance({ navigate }: { navigate: Function }) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);

  const [currentTab, setCurrentTab] = useState(translations[language as keyof typeof translations].ViewWallet.tab_list[0]);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [network,] = useRecoilState(activeNetwork);
  const [networks, setAllNetworks] = useRecoilState(networkList);
  const [chainName, setChainName] = useState(chainIdToNameMap[network.chainId as keyof typeof chainIdToNameMap] || 1);
  const conversionRate = 1;
  const currency = 'USD';
  const [currentHoldings, setCurrentHoldings] = useState({
    meta: {
      'date': ''
    },
    x: 0,
    y: 0
  });
  const [secondToLastHoldings, setSecondToLastHoldings] = useState({
    percent: '0%',
    trend: 'flat',
    y: '0.00',

  })

  const getData = async () => {
    try {
      const historyResults = await getWalletHistory(wallet.address, chainName as string);
      const outputData = processJsonData(historyResults);
      // ONLY FOR TESTING - USED TO FILL CHART VALUES WHEN ALL ARE EMPTY
      //const isReady = outputData.openQuotesByDay[0].totalQuote === null || outputData.openQuotesByDay[0].totalQuote === 0;
      const openQuotes = outputData.openQuotesByDay.reduce((finalVal, d, _i) => {
        return {
          ...finalVal,
          quotes: [...finalVal.quotes, d]
        } as OpenQuotes;
      }, {
        direction: 'down',
        quotes: []
      } as OpenQuotes)
      // END TESTING PORTION
      const finalQuotes = openQuotes.quotes.map((d) => {
        return {
          meta: {
            'date': d.date
          },
          x: moment(d.date).unix(),
          y: Math.round(((d.totalQuote * conversionRate) + Number.EPSILON) * 100) / 100
        }
      });
      //console.log(finalQuotes[0]);
      //console.log(finalQuotes[1]);
      setCurrentHoldings(finalQuotes[0]);
      //console.log('1');
      const percent = (((finalQuotes[1].y - finalQuotes[0].y) / finalQuotes[0].y) || 0).toFixed(0) + '%';
      //console.log('2');
      const trend = finalQuotes[1].y > finalQuotes[0].y ? 'up' : finalQuotes[1].y < finalQuotes[0].y ? 'down' : 'flat';
      //console.log('3');
      const y = (finalQuotes[1].y - finalQuotes[0].y).toFixed(2);
      //console.log('4');
      setSecondToLastHoldings({
        percent,
        trend,
        y
      })
    } catch (err) {
      //
      console.log(err);
      setTimeout(() => {
        getData();
      }, 1000)

    }

  }

  useEffect(() => {
    if (_wallet.name !== '' && network) {
      setWallet(new WalletInternal(_wallet.wallet));
    }
  }, [_wallet, network]);

  useEffect(() => {
    if (wallet.address) {
      setCurrentHoldings({
        meta: {
          'date': ''
        },
        x: 0,
        y: 0
      });
      getData();
    }
  }, [wallet, chainName])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    setTimeout(async () => {
      setRefreshing(false);
    }, 100)
  }, []);

  useEffect(() => {
    //setNetwork(null)
    //setAllNetworks([])
  }, [])

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

            <HStack paddingBottom={0} space={1}>
              <Heading ><Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? "darkText" : "lightText"} >{CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]}{currentHoldings ? formatCurrency(currentHoldings.y.toString()) : '0.00'}</Text></Heading>
              <Text color={colorMode === 'dark' ? "darkText" : "lightText"} fontWeight={'bold'}>{chainName}</Text>

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