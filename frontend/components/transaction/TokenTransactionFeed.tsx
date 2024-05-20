import {
  Box,
  FlatList,
  HStack,
  ScrollView,
  Text
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { SvgUri } from 'react-native-svg';

import { activeNetwork, activeWallet, language as stateLanguage } from "../../service/state";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTokenTransferHistory, getWalletTransactions } from "../../service/api";
import { CovalentTransaction, CovalentTransactionV3 } from "../../service/transaction";
import { chainIdToNameMap } from "../../service/constants";
import { Pressable, RefreshControl } from "react-native";
import CovalentItem from './CovalentItem';
import { getActiveNetwork } from "../../store/network";
import { useIsFocused } from "@react-navigation/native";
import { ethers } from "ethers";
import { compareAddresses } from "../../service/utility";
import { CovalentTokenHistoryItem, CovalentTransferHistory } from "../../types/token";
import { getTokenHistoryItems, storeTokenHistoryItems } from "../../store/token";
import CovalentTransferItem from "./CovalentTransferItem";

export default function TransactionFeed({ navigation, tokenAddress }: { navigation: { navigate: Function }, tokenAddress: string }) {
  const isFocused = useIsFocused();
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = useState(false);
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [transactions, setTransactions] = useState([] as CovalentTokenHistoryItem[]);
  //{translations[language].BasePage.title}
  useEffect(() => {
    let isMounted = true;
    if (_wallet) {
      if (isMounted) setRefreshing(true);
      setTimeout(async () => {
        const _network = await getActiveNetwork();
        const _transactions = await getTokenTransferHistory(_wallet.address, tokenAddress, chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap]);

        if (_transactions && _transactions.items) {
          if (isMounted) setTransactions(_transactions.items as CovalentTokenHistoryItem[]);
        }
        if (isMounted) setRefreshing(false);
      }, 100)
    }
    return () => { isMounted = false }
  }, [_wallet])

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _network = await getActiveNetwork();
      if (isMounted) storeTokenHistoryItems(_wallet.address, tokenAddress, _network.chainId, transactions);
    }
    if (transactions.length > 0) {
      runAsync();
    }
    return () => {
      isMounted = false;
    }
  }, [transactions])

  const syncTransactions = async () => {
    setRefreshing(true);
    setTimeout(async () => {
      const _network = await getActiveNetwork();
      const _transactions = await getTokenTransferHistory(_wallet.address, tokenAddress, chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap]);

      if (_transactions && _transactions.items) {
        setTransactions(_transactions.items as CovalentTokenHistoryItem[]);
      }
      setRefreshing(false);
    }, 100)

  }

  useEffect(() => {
    const runAsync = async () => {
      const _transactions = await getTokenHistoryItems(_wallet.address, tokenAddress, network.chainId);
      if (_transactions && _transactions.length > 0) {
        setTransactions(_transactions);
      }
      syncTransactions();

    }
    if (_wallet.address) {
      runAsync();
    }
  }, [])
  return (
    <Box paddingY={4}>
      <FlatList data={transactions} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={syncTransactions}
        />
      } renderItem={
        ({ item, index }) => <CovalentTransferItem key={item.tx_hash} transaction={item} navigation={navigation} />
      }
        keyExtractor={item => `${item.tx_hash}:${item}`}
      />
      {transactions.length === 0 &&
        <Pressable onPress={() => {
          setRefreshing(true);
          setTimeout(() => {
            syncTransactions()
          }, 1000)
        }}>
          <HStack justifyContent={'center'} alignItems={'center'}>
            <Text>No transactions on this network</Text>
          </HStack>
        </Pressable>
      }
    </Box>
  );
}