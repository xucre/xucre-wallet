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
import { getTokenTransferHistory } from "../../service/api";
import { chainIdToNameMap } from "../../service/constants";
import { Pressable, RefreshControl } from "react-native";
import { getActiveNetwork } from "../../store/network";
import { useIsFocused } from "@react-navigation/native";
import { CovalentTokenHistoryItem } from "../../types/token";
import { getTokenHistoryItems, storeTokenHistoryItems } from "../../store/token";
import CovalentTransferItem from "./CovalentTransferItem";
import useTokenHistory from "../../hooks/useTokenHistory";
import usePagination from "../../hooks/usePagination";

export default function TransactionFeed({ navigation, tokenAddress, chainId }: { navigation: { navigate: Function }, tokenAddress: string, chainId: number }) {
  const isFocused = useIsFocused();
  const [language,] = useRecoilState(stateLanguage);
  //const [refreshing, setRefreshing] = useState(false);
  const [network,] = useRecoilState(activeNetwork);
  const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const { transactions, refreshing, reset } = useTokenHistory(tokenAddress, chainId);

  const syncTransactions = async () => {
    await reset();
  }

  const { paginatedData, loadMore } = usePagination(transactions, { initialPageSize: 10, append: true });

  return (
    <Box paddingY={4}>
      <FlatList data={paginatedData} refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={syncTransactions}
        />
      } renderItem={
        ({ item, index }) => <CovalentTransferItem key={item.tx_hash} transaction={item} navigation={navigation} />
      }
        keyExtractor={item => `${item.tx_hash}:${item}`}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
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