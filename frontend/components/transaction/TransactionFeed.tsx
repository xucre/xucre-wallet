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
  const { transactions: _transactions, transactionsTotal, refreshing, reset } = useTransactions();
  const syncTransactions = async () => {
    await reset();
  }

  const transactions = !chainId && chainId !== 0 ? transactionsTotal[chainId] : _transactions;
  const filteredTransactions = !transactions ? [] : transactions.filter((transaction) =>
    (tokenAddress &&
      (compareAddresses(transaction.to_address, tokenAddress) || compareAddresses(transaction.from_address, tokenAddress))
    ) || !tokenAddress);
  const { paginatedData, loadMore } = usePagination(filteredTransactions, { initialPageSize: 10, append: true, uniqueKey: 'tx_hash' });
  //console.log(paginatedData);
  return (
    <Box paddingY={4} h={'1/2'}>
      <FlatList data={paginatedData} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={syncTransactions}
        />
      } renderItem={
        ({ item, index }) => <CovalentItem key={item.tx_hash} transaction={item} navigation={navigation} />
      }
        keyExtractor={item => item.tx_hash}
        onEndReached={loadMore}
        ListEmptyComponent={<Text textAlign={'center'}>{translations[language as keyof typeof translations].ui.no_items}</Text>}
      />
      {(!filteredTransactions || filteredTransactions.length === 0) || (!paginatedData || paginatedData.length === 0) &&
        <Pressable onPress={() => {
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