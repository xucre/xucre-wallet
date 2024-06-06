import {
  Box,
  FlatList,
  HStack,
  ScrollView,
  Text
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { activeNetwork, activeWallet, language as stateLanguage } from "../../service/state";
import { Pressable, RefreshControl } from "react-native";
import CovalentItem from './CovalentItem';
import { useIsFocused } from "@react-navigation/native";
import { compareAddresses } from "../../service/utility";
import useTransactions from "../../hooks/useTransactions";

export default function TransactionFeed({ navigation, tokenAddress, updateDefault }: { navigation: { navigate: Function }, tokenAddress: string | null, updateDefault: Function | null }) {
  const isFocused = useIsFocused();
  const [language,] = useRecoilState(stateLanguage);
  //const [refreshing, setRefreshing] = useState(false);
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const { transactions, refreshing, reset } = useTransactions()
  const syncTransactions = async () => {
    await reset();
  }

  const filteredTransactions = !transactions ? [] : transactions.filter((transaction) =>
    (tokenAddress &&
      (compareAddresses(transaction.to_address, tokenAddress) || compareAddresses(transaction.from_address, tokenAddress))
    ) || !tokenAddress);
  return (
    <Box paddingY={4}>
      <FlatList data={filteredTransactions} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={syncTransactions}
        />
      } renderItem={
        ({ item, index }) => <CovalentItem key={item.tx_hash} transaction={item} navigation={navigation} />
      }
        keyExtractor={item => item.tx_hash}
      />
      {(!transactions || transactions.length === 0) &&
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