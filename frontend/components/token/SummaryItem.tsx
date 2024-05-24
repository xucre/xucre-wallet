import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber } from "ethers";
import { Avatar, HStack, Icon, IconButton, Menu, Pressable, Skeleton, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { getIconImage } from "../../service/api";
import { activeNetwork, activeWallet } from "../../service/state";
import { language as stateLanguage } from "../../service/state";

import { Token } from '../../service/token';
import { ItemsWithOpenQuote } from "../../types/history";
import currency from "currency.js"
import { useConversionRate } from "../../hooks/useConversionRate";
import { CURRENCY_SYMBOLS } from "../../data/CurrencyData";

export default function SummaryItem({ token }: { token: ItemsWithOpenQuote }) {
  const { colorMode } = useColorMode();
  const { conversionRate } = useConversionRate();
  const [tokenImage, setTokenImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      try {
        if (token.contract.ticker_symbol) {
          const img = await getIconImage(token.contract.ticker_symbol.toLowerCase());

          if (isMounted) setTokenImage(img as string);
        } else {
          if (isMounted) setLoading(false);
        }
      } catch (err) {
        //
      }
    }
    if (token.contract.ticker_symbol) {
      runAsync();
    }

    return () => { isMounted = false };
  }, [token])

  const TokenIcon = ({ iname }: { iname: string }) => {

    if (
      iname.toLowerCase() === 'matic' ||
      iname.toLowerCase() === 'btc' ||
      iname.toLowerCase() === 'eth'
    ) {
      //
    }
    const isDark = colorMode === 'dark';
    return (
      <>

        {loading &&
          <Skeleton rounded={'full'} size={10} fadeDuration={1} />
        }
        {tokenImage !== '' &&
          <Avatar _image={{ onLoadEnd: () => { setLoading(false) } }} bg={isDark ? 'coolGray.800' : 'coolGray.300'} mr="1" source={{
            uri: tokenImage
          }}>
            <Text>{iname}</Text>
          </Avatar>
        }

        {tokenImage === '' &&
          <Avatar bg="primary.600" mr="1" >
            <Text>{iname}</Text>
          </Avatar>
        }

      </>
    )
  }

  const convertedValue = conversionRate && conversionRate.value ? currency((token.mostRecentOpenQuote.quote * conversionRate.value) || 0, { fromCents: true, precision: 3, symbol: CURRENCY_SYMBOLS[conversionRate.currency as keyof typeof CURRENCY_SYMBOLS] }).format()
    : currency(token.mostRecentOpenQuote.quote || 0, { fromCents: true, precision: 3 }).format();
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <HStack alignItems="center" space={{ base: 3, md: 6 }}>
        <TokenIcon iname={token.contract.ticker_symbol} />

        <VStack>
          <Pressable>
            <Text fontSize="md" bold>
              {token.contract.ticker_symbol}
            </Text>
          </Pressable>
        </VStack>
      </HStack>
      <HStack alignItems="center" space={{ base: 2 }}>
        <Text
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          bold
          fontWeight="normal">{token.mostRecentOpenQuote.quote || 0}</Text>

        <Text
          _light={{ color: 'coolGray.500' }}
          _dark={{ color: 'coolGray.400' }}
          fontWeight="normal">{convertedValue}</Text>
      </HStack>
    </HStack>
  )
}