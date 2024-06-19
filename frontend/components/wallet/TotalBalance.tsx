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
import currency from "currency.js";

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
import { useConversionRate } from "../../hooks/useConversionRate";
import useWalletHistory from "../../hooks/useWalletHistory";

export default function TotalBalance({ navigate }: { navigate: Function }) {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();
  const { conversionRate } = useConversionRate();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const { currentHoldings, secondToLastHoldings, reset } = useWalletHistory();

  const emptyFunction = () => { };
  const emptyNavigation = { navigate: emptyFunction };
  useEffect(() => {
    if (_wallet.name !== '') {
      setWallet(new WalletInternal(_wallet.wallet));
    }
  }, [_wallet]);

  const formatCurrency = (amount: string) => {
    return Number.parseFloat(amount).toFixed(2);
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

  const convertedTrendValue = () => {
    if (secondToLastHoldings && secondToLastHoldings.y) {
      if (conversionRate && conversionRate.value) {
        const _convertedValue = Number(secondToLastHoldings.y) * conversionRate.value;
        return currency(_convertedValue, { precision: 2, symbol: CURRENCY_SYMBOLS[conversionRate.currency as keyof typeof CURRENCY_SYMBOLS] }).format();
      }
      return currency(secondToLastHoldings.y, { precision: 2 }).format();
    }
    return currency(0, { precision: 2 }).format();
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
              <Heading ><Text fontSize={'3xl'} fontWeight={'bold'} color={colorMode === 'dark' ? "darkText" : "lightText"} >{convertedValue()}</Text></Heading>
              {/*<NetworkIcon navigation={emptyNavigation} isInline={true} close={emptyFunction} />*/}
              {/*<Text color={colorMode === 'dark' ? "darkText" : "lightText"} fontWeight={'bold'}>{chainName}</Text>*/}

            </HStack>

            <Badge rounded={10} variant={'solid'} backgroundColor={colorMode === 'dark' ? "black" : "primary.500"} maxWidth={'3/5'} marginTop={2}>
              <HStack paddingY={1} space={1} alignItems={'center'}>
                {secondToLastHoldings.trend === 'up' &&
                  <Icon as={MaterialIcons} name="trending-up" color={colorMode === 'dark' ? "primary.500" : "darkText"} size={'sm'} marginRight={1.5} />
                }
                {secondToLastHoldings.trend === 'flat' &&
                  <Icon as={MaterialIcons} name="trending-flat" color={colorMode === 'dark' ? "primary.500" : "darkText"} size={'sm'} marginRight={1.5} />
                }
                {secondToLastHoldings.trend === 'down' &&
                  <Icon as={MaterialIcons} name="trending-down" color={colorMode === 'dark' ? "primary.500" : "darkText"} size={'sm'} marginRight={1.5} />
                }
                <Text textAlign={'left'} color={colorMode === 'dark' ? 'white' : 'black'} marginRight={1.5}>{convertedTrendValue()}</Text>
                <Text textAlign={'left'} color={'coolGray.500'}>{`(${secondToLastHoldings.percent})`}</Text>
              </HStack>

            </Badge>
          </Box>
        }
      </Pressable>
    </Box>
  )
}