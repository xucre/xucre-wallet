import {
  Box,
  FlatList,
  HStack,
  ScrollView,
  Text
} from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { activeNetwork, activeWallet, language as stateLanguage } from "../../service/state";
import { Pressable, RefreshControl } from "react-native";
import CovalentItem from './CovalentItem';
import { useIsFocused } from "@react-navigation/native";
import { compareAddresses } from "../../service/utility";
import useTransactions from "../../hooks/useTransactions";
import usePagination from "../../hooks/usePagination";
import translations from "../../assets/translations";

export default function TransactionFeed({ navigation, tokenAddress, updateDefault, chainId }: { navigation: { navigate: Function }, tokenAddress: string | null, updateDefault: Function | null, chainId: number }) {
  const isFocused = useIsFocused();
  const [language,] = useRecoilState(stateLanguage);
  //const [refreshing, setRefreshing] = useState(false);
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const { transactions: _transactions, transactionsTotal, parsedTransactions: _parsedTransactions, parsedTransactionsTotal, refreshing, reset } = useTransactions();
  const syncTransactions = async () => {
    await reset();
  }

  // const transactions = useMemo(() => {
  //   return !chainId && chainId !== 0 ? transactionsTotal[chainId] : _transactions;
  // }, [chainId, _transactions, transactionsTotal]);

  // const filteredTransactions = useMemo(() => {
  //   return !transactions ? [] : transactions.filter((transaction) =>
  //     (tokenAddress &&
  //       (compareAddresses(transaction.to_address, tokenAddress) || compareAddresses(transaction.from_address, tokenAddress))
  //     ) || !tokenAddress);
  // }, [transactions, tokenAddress]);

  // const sortedTransactions = useMemo(() => {
  //   return [...filteredTransactions].sort((a, b) => {
  //     if (a.block_height < b.block_height) return 1;
  //     if (a.block_height > b.block_height) return -1;
  //     return 0;
  //   });
  // }, [filteredTransactions]);

  const parsedTransactions = useMemo(() => {
    return chainId && chainId !== 0 ? parsedTransactionsTotal[chainId] : _parsedTransactions;
  }, [chainId, _parsedTransactions, parsedTransactionsTotal]);

  const filteredParsedTransactions = useMemo(() => {
    return !parsedTransactions ? [] : parsedTransactions.filter((transaction) =>
      transaction.covalentData && (
        (tokenAddress &&
          (compareAddresses(transaction.covalentData.to_address, tokenAddress) || compareAddresses(transaction.covalentData.from_address, tokenAddress))
        ) || !tokenAddress));
  }, [parsedTransactions, tokenAddress]);

  const sortedParsedTransactions = useMemo(() => {
    try {
      if (!filteredParsedTransactions || filteredParsedTransactions.length === 0) return [];
      return [...filteredParsedTransactions].sort((a, b) => {
        if (a.covalentData.block_height < b.covalentData.block_height) return 1;
        if (a.covalentData.block_height > b.covalentData.block_height) return -1;
        return 0;
      });
    } catch (e) {
      return [];
    }

  }, [filteredParsedTransactions]);

  return (
    <Box paddingY={4} h={'1/2'}>
      <FlatList data={sortedParsedTransactions} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={syncTransactions}
        />
      } renderItem={
        ({ item, index }) => <CovalentItem key={item.covalentData.tx_hash} transaction={item} navigation={navigation} />
      }
        keyExtractor={item => item.covalentData.tx_hash}
        //onEndReached={loadMore}
        ListEmptyComponent={<Text textAlign={'center'}>{translations[language as keyof typeof translations].ui.no_items}</Text>}
      />
    </Box>
  );
}