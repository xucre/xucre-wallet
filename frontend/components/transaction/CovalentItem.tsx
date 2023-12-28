import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import moment from 'moment';
import { Avatar, Box, Center, createIcon, HStack, Icon, IconButton, Menu, Pressable, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { Linking } from "react-native";
import { useRecoilState } from "recoil";

import { activeNetwork } from "../../service/state";
import { isSVGFormatImage, truncateString } from "../../service/utility";
import { CovalentTransactionV3 } from "../../service/transaction";
import { SvgUri } from "react-native-svg";
import { iconBackground } from "../../assets/styles/themeContext";

export default function CovalentItem({ navigation, transaction }: { navigation: { navigate: Function }, transaction: CovalentTransactionV3 }) {
  const { colorMode } = useColorMode();

  const [network,] = useRecoilState(activeNetwork);
  const openTransaction = () => {
    const blockUrl = network?.blockExplorer?.endsWith('/') ? network.blockExplorer + 'tx/' + transaction.tx_hash : network.blockExplorer + '/tx/' + transaction.tx_hash;

    Linking.openURL(blockUrl);
  }

  useEffect(() => {
    //console.log(transaction);
    //console.log(transaction.gas_metadata?.logo_url);
  }, [])

  const CustomIcon = ({ data, size }: { data: any, size: number }): JSX.Element => {
    return <SvgUri
      width={size}
      height={size}
      uri={data}
    />
  }

  const TokenIcon = ({ iname }: { iname: string }) => {
    const icon_color = colorMode === 'dark' ? 'white' : 'black';
    const isSvg = isSVGFormatImage(transaction.dex_details?.token_1_logo_url || transaction.gas_metadata?.logo_url);
    return (
      <>
        {isSvg &&
          <Center padding={4} borderRadius={100} bgColor={iconBackground(colorMode)} w={10} h={10}>
            <CustomIcon data={transaction.dex_details?.token_1_logo_url || transaction.gas_metadata?.logo_url} size={24} />
          </Center>
        }
        {!isSvg &&
          <Avatar bg={iconBackground(colorMode)} mr="1" source={{
            uri: transaction.dex_details?.token_1_logo_url || transaction.gas_metadata?.logo_url || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
          }} size={10}>
            {iname}
          </Avatar>
        }

      </>
    )
  }

  return (
    <Pressable onPress={() => { openTransaction() }} >
      {({
        isHovered,
        isFocused,
        isPressed
      }) => {
        return (
          <HStack alignItems="center" justifyContent="space-between" rounded={10} py={2} px={1} backgroundColor={isPressed ? colorMode === 'dark' ? 'dark.300' : 'light.300' : 'transparent'}>
            <HStack alignItems="center" space={{ base: 3, md: 6 }}>
              <HStack space={{ base: 3, md: 6 }} justifyContent={'center'} alignItems={'center'}>
                <TokenIcon iname={transaction.gas_metadata?.contract_ticker_symbol} />
                <VStack space={{ base: 0 }} justifyContent={'space-around'} alignItems={'flex-start'}>
                  <Text fontSize="sm" bold>
                    {BigNumber.from(transaction.value).isZero() ? '$0.00' : transaction.pretty_value_quote}
                  </Text>
                  <Text fontSize="sm">
                    {transaction.block_signed_at &&
                      <>{moment(transaction.block_signed_at as string).fromNow()}</>}
                    {!transaction.block_signed_at &&
                      <>{truncateString(transaction.tx_hash as string, 15)}</>}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
            <HStack alignItems="center" space={{ base: 2 }}>
              <VStack alignItems={'flex-end'}>
                <Text>
                  {transaction.dex_details ? ethers.utils.formatEther(transaction.dex_details.token_1_amount) : ethers.utils.formatEther(transaction.value)}
                </Text>
                <Text
                  color={(!transaction.successful) ? 'error.500' : 'success.500'}
                  rounded={'md'}
                  fontWeight="normal">{transaction.successful ? 'Completed' : 'Failure'}</Text>
              </VStack>
            </HStack>
          </HStack>
        )
      }}
    </Pressable>
  )
}