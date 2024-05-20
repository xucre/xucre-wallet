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

import translations from "../../assets/translations";
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
import { NFT, NFTHolding } from "../../types/nft";
import useNFTs from "../../hooks/useNFTs";

export default function NftDashboard({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [chain, setChain] = useState('');
  const [wallet, setActiveWallet] = useState({
    name: '',
    wallet: {}
  } as AppWallet);
  //const [_wallet, setActiveWallet] = useRecoilState(activeWallet);
  const [holdings, setHoldings] = useState([] as NFTHolding[]);
  const { trending, collections, trendingRefreshing, collectionsRefreshing, reset } = useNFTs();
  const refreshing = trendingRefreshing || collectionsRefreshing;

  // Transitions
  const [displayTooltip, setDisplayTooltip] = useState(false);

  const syncNfts = async (save: boolean) => {
    try {
      if (wallet.name.length > 0) {
        const _network = await getActiveNetwork();
        const _tokens = await getNfts(wallet.address, chainIdToNameMapNFT[_network.chainId as keyof typeof chainIdToNameMapNFT]);
        if (save) {
          setChain(_tokens.chain);
          setHoldings(_tokens.results);
        }

        return { _chain: _tokens.chain, _holdings: _tokens.results }
      }
    } catch (err) {

    }
    return { _chain: '', _holdings: [] }
  }

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      if (wallet.name.length > 0) {
        //reset();
        const { _chain, _holdings } = await syncNfts(false);
        if (isMounted) {
          setChain(_chain);
          setHoldings(_holdings);
        }
      }
    }

    runAsync();
    return () => {
      isMounted = false;
    }
  }, [wallet])

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _wallet = await getActiveWallet();
      if (isMounted) setActiveWallet(_wallet[0]);
    }

    runAsync();
    return () => {
      isMounted = false;
    }
  }, [])


  const onRefresh = React.useCallback(async () => {
    syncNfts(true);
    reset();
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
          >{translations[language as keyof typeof translations].NftDashboard.trending}</Text>

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
          >{translations[language as keyof typeof translations].NftDashboard.collections}</Text>
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
          >{translations[language as keyof typeof translations].NftDashboard.your_list}</Text>

          {holdings.length > 0 ?
            <FlatList data={holdings} mb={20} mx={3} renderItem={
              ({ item: nft, index: i }) => <NftListItem key={nft.contract_address + nft.id + i} token={nft.id} contract={nft.contract_address} chain={chain} />
            }
              keyExtractor={item => item.contract_address + item.id}
            /> : <Text fontWeight="medium" textAlign={'center'}>{translations[language as keyof typeof translations].NftDashboard.no_holdings}</Text>
          }

        </ScrollView>
      }

      <MobileFooter navigation={navigation}></MobileFooter>
    </Box>
  )
}