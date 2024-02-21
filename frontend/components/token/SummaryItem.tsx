import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import { Avatar, HStack, Icon, IconButton, Menu, Pressable, Skeleton, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import translations from "../../assets/translations";
import { getIconImage } from "../../service/api";
import { activeNetwork, activeWallet } from "../../service/state";
import { language as stateLanguage } from "../../service/state";

import { truncateString } from "../../service/utility";
import { Token } from '../../service/token';
import { ItemsWithOpenQuote } from "../../types/history";

export default function SummaryItem({ token }: { token: ItemsWithOpenQuote }) {
  const { colorMode } = useColorMode();
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [tokenImage, setTokenImage] = useState('');
  const [language,] = useRecoilState(stateLanguage);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  useEffect(() => {
    //
  }, [tokenImage])
  useEffect(() => {
    const runAsync = async () => {
      try {
        if (token.contract.ticker_symbol) {
          const img = await getIconImage(token.contract.ticker_symbol.toLowerCase());

          setTokenImage(img as string);
        } else {
          setLoading(false);
        }

        //const blob = new Blob([img.data], {type: "image/png"})
        //const fileReaderInstance = new FileReader();
        //fileReaderInstance.readAsDataURL(blob); 
        //fileReaderInstance.onload = () => {
        //setTokenImage(fileReaderInstance.result as string);
        //}

      } catch (err) {
        //
      }
    }
    if (token.contract.ticker_symbol) {
      runAsync();
    }
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
          fontWeight="normal">{token.mostRecentOpenQuote.quote || 0}</Text>

      </HStack>
    </HStack>
  )
}