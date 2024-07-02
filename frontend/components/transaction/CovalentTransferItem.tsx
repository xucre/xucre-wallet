import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
//import moment from 'moment';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { Avatar, Badge, Box, Center, createIcon, HStack, Icon, IconButton, Menu, Pressable, Spinner, Text, Tooltip, useColorMode, VStack, } from "native-base";
import React, { createRef, useEffect, useState } from "react";
import { Linking } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";

import { activeNetwork, activeWallet } from "../../service/state";
import { isSVGFormatImage, truncateString } from "../../service/utility";
import { CovalentTransactionV3, ParsedTransaction, parseTransaction } from "../../service/transaction";
import { SvgUri } from "react-native-svg";
import { iconBackground } from "../../assets/styles/themeContext";
import { WalletInternal } from "../../store/wallet";
import { getIsSpam } from "../../service/api";
import { actionToScheme } from "../../service/constants";
import { storeParsedTransaction } from "../../store/transactionFeedItem";
import { CovalentTokenHistoryItem } from "../../types/token";

dayjs.extend(relativeTime);

function CovalentTransferItemComponent({ navigation, transaction }: { navigation: { navigate: Function }, transaction: CovalentTokenHistoryItem }) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const wallet = useRecoilValue(activeWallet);
  const network = useRecoilValue(activeNetwork);

  const openTransaction = () => {
    const blockUrl = network?.blockExplorer?.endsWith('/') ? network.blockExplorer + 'tx/' + transaction.tx_hash : network.blockExplorer + '/tx/' + transaction.tx_hash;

    Linking.openURL(blockUrl);
  }

  const CustomIcon = ({ data, size }: { data: any, size: number }): JSX.Element => {
    return <SvgUri
      width={size}
      height={size}
      uri={data}
      onError={() => { }}
    />
  }

  const TokenIcon = ({ iname }: { iname: string }) => {
    const icon_color = colorMode === 'dark' ? 'white' : 'black';
    //const isSvg = isSVGFormatImage(transaction.dex_details?.token_1_logo_url || transaction.gas_metadata?.logo_url);
    const isSvg = isSVGFormatImage(transaction.gas_metadata?.logo_url);
    try {
      return (
        <>
          {isSvg &&
            <Avatar bg={iconBackground(colorMode)} mr="1" size={10}>
              <CustomIcon data={transaction.gas_metadata?.logo_url} size={24} />
            </Avatar>
          }
          {!isSvg &&
            <Avatar bg={iconBackground(colorMode)} mr="1" source={{
              uri: transaction.gas_metadata?.logo_url || 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
            }} size={10}>
              {iname}
            </Avatar>
          }

        </>
      )
    } catch (err) {
      return <Avatar style={{ "display": loading ? 'none' : 'flex' }} bg="transparent" mr="1" source={{
        uri: 'https://xucre-public.s3.sa-east-1.amazonaws.com/xucre.png'
      }} size={10}>
        <Text>{iname}</Text>
      </Avatar>
    }

  }

  const getItemStatus = () => {
    return transaction.successful ? 'Completed' : 'Failure';
  }

  const getItemAmount = () => {
    return transaction.transfers.length > 0 ?
      //(transaction.transfers[0].delta_quote ? transaction.transfers[0].delta_quote : ethers.utils.formatUnits(transaction.transfers[0].delta, transaction.transfers[0].contract_decimals)) + ' ' + transaction.transfers[0].contract_ticker_symbol :
      ethers.utils.formatUnits(transaction.transfers[0].delta, transaction.transfers[0].contract_decimals) + ' ' + transaction.transfers[0].contract_ticker_symbol :
      ethers.utils.formatEther(transaction.value) + ' ' + transaction.gas_metadata.contract_ticker_symbol
  }

  const ItemAction = () => {
    return (
      <Badge variant={'solid'} colorScheme={getItemActionScheme(transaction.transfers.length > 0 ? transaction.transfers[0].transfer_type as string : 'Unknown')} alignSelf={'auto'}>
        <Text fontSize="sm" bold>
          {transaction.transfers.length > 0 ? transaction.transfers[0].transfer_type as string : 'Unknown'}
        </Text>
      </Badge>
    )
  }

  const getItemActionScheme = (type: string) => {
    try {
      return actionToScheme[type as keyof typeof actionToScheme];
    } catch (err) {
      return actionToScheme.Unknown;
    }

  }

  if (transaction.transfers.length < 1) {
    return <></>
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

            <HStack alignItems={'center'} space={{ base: 6 }}>
              <TokenIcon iname={transaction.gas_metadata?.contract_ticker_symbol} />

              <VStack space={{ base: 0 }} justifyContent={'space-around'} alignItems={'flex-start'}>
                <ItemAction />
                <Text fontSize="sm">
                  {transaction.block_signed_at &&
                    <>{dayjs(transaction.block_signed_at as string).fromNow()}</>}
                  {!transaction.block_signed_at &&
                    <>{truncateString(transaction.tx_hash as string, 7)}</>}
                </Text>
              </VStack>
            </HStack>
            <VStack alignItems={'flex-end'}>
              <Text>
                {getItemAmount()}
              </Text>
              {loading && <Spinner size="sm" />}
              {!loading &&
                <Text
                  color={(!transaction.successful) ? 'error.500' : 'success.500'}
                  rounded={'md'}
                  fontWeight="normal">{getItemStatus()}</Text>
              }
            </VStack>
          </HStack>
        )
      }}
    </Pressable>
  )
}

const CovalentTransferItem = React.memo(CovalentTransferItemComponent);
export default CovalentTransferItem;