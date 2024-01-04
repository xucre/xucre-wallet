import { MaterialIcons } from "@expo/vector-icons";
import { BigNumber, ethers, getDefaultProvider, Wallet } from "ethers";
import moment from 'moment';
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

export default function CovalentItem({ navigation, transaction }: { navigation: { navigate: Function }, transaction: CovalentTransactionV3 }) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const wallet = useRecoilValue(activeWallet);
  const network = useRecoilValue(activeNetwork);
  const [transactionDetails, setTransactionDetails] = useState({} as ParsedTransaction)

  const openTransaction = () => {
    const blockUrl = network?.blockExplorer?.endsWith('/') ? network.blockExplorer + 'tx/' + transaction.tx_hash : network.blockExplorer + '/tx/' + transaction.tx_hash;

    Linking.openURL(blockUrl);
  }

  useEffect(() => {
    if (transaction && wallet.wallet.length > 0 && network.chainId) parseDetails();
  }, [transaction, wallet, network])

  useEffect(() => {
    //console.log(transactionDetails);
  }, [transactionDetails])

  const parseDetails = async () => {
    setLoading(true);
    const result: ParsedTransaction = await parseTransaction(new WalletInternal(wallet.wallet), transaction, network);
    if (result.action === 'Unknown') {
      const isSpam = await getIsSpam(result.contractAddress, network.chainId);
      //console.log('isSpam', isSpam, result.action);
      setTransactionDetails({ ...result, spam: isSpam === true })
    } else {
      setTransactionDetails({ ...result })
    }

    setLoading(false);
  }

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

  const getItemStatus = () => {
    if (transactionDetails.spam) {
      return 'Spam'
    }

    return transaction.successful ? 'Completed' : 'Failure';
  }

  const getItemAmount = () => {
    return transaction.dex_details ?
      ethers.utils.formatEther(transaction.dex_details.token_1_amount) + ' ' + transaction.dex_details.token_1_ticker :
      ethers.utils.formatEther(transaction.value) + ' ' + transaction.gas_metadata.contract_ticker_symbol
  }

  const ItemAction = () => {
    return (
      <Badge variant={'solid'} colorScheme={getItemActionScheme()} alignSelf="center">
        {transactionDetails.action}
      </Badge>
    )
  }

  const getItemActionScheme = () => {
    return actionToScheme[transactionDetails.action as keyof typeof actionToScheme];
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
                    <ItemAction />
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
                  {getItemAmount()}
                </Text>
                {loading && <Spinner size="sm" />}
                {!loading &&
                  <Text
                    color={(!transaction.successful) || transactionDetails.spam ? 'error.500' : 'success.500'}
                    rounded={'md'}
                    fontWeight="normal">{getItemStatus()}</Text>
                }
              </VStack>
            </HStack>
          </HStack>
        )
      }}
    </Pressable>
  )
}