import { useEffect, useState } from 'react';
import { Token } from '../service/token';

import ethTokens from '../../assets/json/eth_tokens.json'
import polygonTokens from '../../assets/json/matic_tokens.json'
import { BigNumber, getDefaultProvider, ethers } from 'ethers';
import { getNftJson, getTokenBalances } from '../service/api';
import { chainIdToNameMap, xucreToken } from '../service/constants';
import { getActiveNetwork } from '../store/network';
import { isSpam } from '../store/spam';
import { getActiveWallet, WalletInternal } from '../store/wallet';
import { AppWallet } from '../service/state';
import { BIOMETRY_TYPE } from 'react-native-keychain';
import { NFT } from '../types/nft';

function useNFTs() {
  const [trending, setTrending] = useState([] as NFT[]);
  const [collections, setCollections] = useState([] as NFT[]);
  const [trendingRefreshing, setTrendingRefreshing] = useState(false);
  const [collectionsRefreshing, setCollectionsRefreshing] = useState(false);

  
  const syncTrendingNfts = async (save: boolean) => {
    setTrendingRefreshing(true);
    const nftJsonTrending = await getNftJson('trending');
    if (save) {
      setTrending(nftJsonTrending.items);
      setTrendingRefreshing(false);
    }
    return nftJsonTrending.items;
  }

  const syncNewNfts = async (save: boolean) => {
    setCollectionsRefreshing(true);
    const nftJsonCollections = await getNftJson('collections');
    if (save) {
      setCollections(nftJsonCollections.items);
      setCollectionsRefreshing(false);
    }

    return nftJsonCollections.items;
  }

  const reset = () => {
    syncTrendingNfts(true);
    syncNewNfts(true);
  }
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _trending = await syncTrendingNfts(false);
      const _collections = await syncNewNfts(false);

      if (isMounted) {
        setTrending(_trending);
        setTrendingRefreshing(false);
        setCollections(_collections);
        setCollectionsRefreshing(false);
      }
    }
    runAsync();
    return () => {
      isMounted = false;
    };
  }, [])


  return { trending, collections, trendingRefreshing, collectionsRefreshing, reset };
}

export default useNFTs;