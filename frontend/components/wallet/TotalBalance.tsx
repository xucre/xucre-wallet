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
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { getWalletHistory } from "../../service/api";
import { chainIdToNameMap, chainNames } from "../../service/constants";
import { activeNetwork, activeWallet, networkList, language as stateLanguage } from "../../service/state";



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

export default function WalletHistory() {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);

  const [currentTab, setCurrentTab] = useState(translations[language].ViewWallet.tab_list[0]);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.BaseProvider);
  const [network,] = useRecoilState(activeNetwork);
  const [networks, setAllNetworks] = useRecoilState(networkList);
  const [chainName, setChainName] = useState(chainIdToNameMap[network.chainId] || 1);
  const [currentHoldings, setCurrentHoldings] = useState({
    y: '0.00'
  });
  const [secondToLastHoldings, setSecondToLastHoldings] = useState({
    percent: '0%',
    trend: 'flat',
    y: '0.00',

  })
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
    const finalQuotes = openQuotes.quotes.map((d) => {
      return {
        meta: {
          'date': d.date
        },
        x: moment(d.date).unix(),
        y: Math.round((d.totalQuote + Number.EPSILON) * 100) / 100
      }
    });
    setCurrentHoldings(finalQuotes[0]);
    setSecondToLastHoldings({
      percent: (((finalQuotes[1].y - finalQuotes[0].y)/finalQuotes[0].y) || 0).toFixed(0)+ '%' ,
      trend: finalQuotes[1].y > finalQuotes[0].y ? 'up' : finalQuotes[1].y < finalQuotes[0].y ? 'down' : 'flat',
      y: (finalQuotes[1].y - finalQuotes[0].y).toFixed(2),
    })
  }

  useEffect(() => {
    if (_wallet.name === '') {
      //navigation.navigate('SelectWallet');
    } else {
      console.log(_wallet.wallet.address);
      setWallet(_wallet.wallet);
    }

    if (network) {
      console.log(network);
    }

    //console.log('ViewWallet', network.chainId);
  }, [_wallet, network]);

  useEffect(() => {
    if (wallet.address) {
      setCurrentHoldings({
        y: '0.00'
      });
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
  
  const formatCurrency = (amount) => {
    return Number.parseFloat(amount).toFixed(2);
  }

  return (
    <Box
      _light={{ backgroundColor: 'white' }}
      _dark={{ backgroundColor: 'black' }}
      safeAreaBottom
    >
      {
        <Box bg={colorMode === 'dark' ? "primary.500" : "tertiary.500"} padding={3} borderRadius={10} marginX={2} >
            
          <Text fontSize={'md'} fontWeight={'bold'} color={colorMode === 'dark' ? "darkText" : "lightText"} paddingTop={3}>{translations[language].totalBalance.title} </Text>
          <HStack paddingBottom={0} space={1}>
            <Heading ><Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? "darkText" : "lightText"} >${formatCurrency(currentHoldings.y)}</Text></Heading>
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
              <Text textAlign={'left'} color={colorMode === 'dark' ? 'white': 'black'} marginRight={1.5}>${formatCurrency(secondToLastHoldings.y)}</Text>
              <Text textAlign={'left'} color={'coolGray.500'}>{`(${secondToLastHoldings.percent})`}</Text>
            </HStack>
            
          </Badge>
        </Box>
      }
    </Box>
  )
}