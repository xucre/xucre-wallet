import {
  Box,
  FlatList,
  HStack,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import { ScrollView } from 'react-native-virtualized-view';
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { useRecoilState } from "recoil";

import { Color } from "../../../GlobalStyles";
import MobileFooter from "../../components/Footer";
import NftItemLarge from "../../components/nft/NftItemLarge";
import NftItemSmall from "../../components/nft/NftItemSmall";
import NftListItem from "../../components/nft/NftListItem";
import { getNftJson } from "../../service/api";
import { chainIdToNameMapNFT, getNfts } from "../../service/blockdaemon";
import { AppWallet, language as stateLanguage } from "../../service/state";
import { getActiveWallet } from "../../store/wallet";
import { getActiveNetwork } from "../../store/network";

export type NFT = { description: string, image: string, key: string, name: string, url: string }
export type NFTHolding = { contract_address: string, id: string }

export default function NftDashboard({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [chain, setChain] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [wallet, setActiveWallet] = useState({
    name: '',
    wallet: {}
  } as AppWallet);
  //const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [holdings, setHoldings] = useState([] as NFTHolding[]);
  const [trending, setTrending] = useState([] as NFT[]);
  const [collections, setCollections] = useState([] as NFT[]);
  const [isComponentMounted, setIsComponentMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsComponentMounted(false);
    }
  }, []);
  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);

  const syncNfts = async () => {
    try {
      if (wallet.name.length > 0) {

        const _network = await getActiveNetwork();
        const _tokens = await getNfts(wallet.address, chainIdToNameMapNFT[_network.chainId as keyof typeof chainIdToNameMapNFT]);
        if (isComponentMounted) {
          setChain(_tokens.chain);
          setHoldings(_tokens.results);
          setRefreshing(false);
        }
      }
    } catch (err) {
      //
    }
  }

  const syncTrendingNfts = async () => {
    try {
      if (wallet.name.length > 0) {
        const nftJson = await getNftJson();
        if (isComponentMounted) {
          setTrending(nftJson.trending);
          setCollections(nftJson.collections);
          setRefreshing(false);
        }
      }
    } catch (err) {
      //
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (wallet.name.length > 0) {
        syncTrendingNfts();
        syncNfts();
      }
    }, 1000)
  }, [wallet])

  useEffect(() => {
    const runAsync = async () => {
      const _wallet = await getActiveWallet();
      setActiveWallet(_wallet[0]);
    }

    runAsync();
  }, [])


  const onRefresh = React.useCallback(async () => {
    //
  }, []);

  const addToken = () => {
    navigation.navigate('AddToken');
  }

  return (
    <Box
      _light={{ backgroundColor: Color.white }}
      _dark={{ backgroundColor: Color.black }}
      height={'100%'}
      safeAreaBottom
    >

      {wallet.name.length > 0 && wallet.address !== '' &&
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.100' }}
            fontSize="md"
            fontWeight="medium"
            m={2}
          >Trending</Text>

          <FlatList data={trending} horizontal={true} renderItem={
            ({ item: nft, index: i }) => <NftItemLarge key={nft.key + i} item={nft} />
          }
            keyExtractor={item => item.key}
          />

          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.100' }}
            fontSize="md"
            fontWeight="medium"
            m={2}
          >Collections</Text>
          <FlatList data={collections} horizontal={true} renderItem={
            ({ item: nft, index: i }) => <NftItemSmall key={nft.key + i} item={nft} />
          }
            keyExtractor={item => item.key}
          />

          <Text
            _light={{ color: 'coolGray.800' }}
            _dark={{ color: 'coolGray.100' }}
            fontSize="md"
            fontWeight="medium"
            p={0}
            m={2}
            mt={0}
          >Your List</Text>

          <FlatList data={holdings} mb={20} mx={3} renderItem={
            ({ item: nft, index: i }) => <NftListItem key={nft.contract_address + nft.id + i} token={nft.id} contract={nft.contract_address} chain={chain} />
          }
            keyExtractor={item => item.contract_address + item.id}
          />
        </ScrollView>
      }

      <MobileFooter navigation={navigation}></MobileFooter>
    </Box>
  )
}