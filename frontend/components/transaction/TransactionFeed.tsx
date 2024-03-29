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
import { getWalletTransactions } from "../../service/api";
import { CovalentTransaction, CovalentTransactionV3 } from "../../service/transaction";
import { chainIdToNameMap } from "../../service/constants";
import { Pressable, RefreshControl } from "react-native";
import CovalentItem from './CovalentItem';
import { getActiveNetwork } from "../../store/network";
import { useIsFocused } from "@react-navigation/native";
import { getFeedItems, storeFeedItems } from "../../store/transactionFeedItem";

export default function TransactionFeed({ navigation }: { navigation: { navigate: Function } }) {
  const isFocused = useIsFocused();
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = useState(false);
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [transactions, setTransactions] = useState([] as CovalentTransactionV3[]);
  //{translations[language].BasePage.title}
  useEffect(() => {
    if (_wallet) {
      syncTransactions();
    }
  }, [_wallet])

  useEffect(() => {
    const runAsync = async () => {
      const _network = await getActiveNetwork();
      storeFeedItems(_wallet.address, _network.chainId, transactions);
    }
    if (transactions.length > 0) {
      runAsync();
    }
  }, [transactions])

  const syncTransactions = async () => {
    setRefreshing(true);
    setTimeout(async () => {
      const _network = await getActiveNetwork();
      const _transactions = await getWalletTransactions(_wallet.address, chainIdToNameMap[_network.chainId as keyof typeof chainIdToNameMap]);
      if (_transactions && _transactions.covalent.items) {
        setTransactions(_transactions.covalent.items as CovalentTransactionV3[]);
      }
      setRefreshing(false);
    }, 100)

  }

  useEffect(() => {
    const runAsync = async () => {
      const _transactions = await getFeedItems(_wallet.address, network.chainId);
      if (_transactions && _transactions.length > 0) {
        setTransactions(_transactions);
      }
      syncTransactions();

    }
    if (isFocused && _wallet.address) {
      runAsync();
    }
  }, [isFocused])
  return (
    <Box paddingY={4}>
      <FlatList data={transactions} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={syncTransactions}
        />
      } renderItem={
        ({ item, index }) => <CovalentItem key={item.tx_hash} transaction={item} navigation={navigation} />
      }
        keyExtractor={item => item.tx_hash}
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