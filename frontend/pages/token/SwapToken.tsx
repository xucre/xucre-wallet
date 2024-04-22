
import { ethers, getDefaultProvider, providers, Wallet } from 'ethers';
import { ScrollView, Text, useColorMode } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
//import { renderToString } from 'react-dom/server';
//import { WebView } from "react-native-webview";
import { Linking, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRecoilState, useRecoilValue } from 'recoil';
import translations from "../../assets/translations";


import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../service/state";
import { WalletInternal } from '../../store/wallet';
import { useIsFocused } from '@react-navigation/core';
import { Token } from '../../service/token';
import { getActiveNetwork } from '../../store/network';

export default function SwapToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentTab, setCurrentTab] = useState(translations[language as keyof typeof translations].ViewWallet.tab_list[0]);
  const [_walletList,] = useRecoilState(walletList);
  const [_wallet,] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const network = useRecoilValue(activeNetwork);
  const [tokens, setTokens] = useState([] as Token[]);
  useEffect(() => {
    const runAsync = async () => {
      const _network = await getActiveNetwork();
      const _provider = new ethers.providers.JsonRpcProvider(_network.rpcUrl);
      //setProvider(_provider);
      const newWallet = new WalletInternal(_wallet.wallet).connect(_provider);
      setWallet(newWallet);
    }
    if (_wallet.name != '' && network) {
      /*const _provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      setProvider(_provider);
      const newWallet = new WalletInternal(_wallet.wallet).connect(_provider);
      setWallet(newWallet);*/
    }
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
    }
    if (network) {
      runAsync();
    }

  }, [network])

  //const url = 'https://app.uniswap.org/#/swap';
  let webViewRef: any = useRef(null);
  const onRefresh = () => {
    if (webViewRef.current) {

      webViewRef.current.clearCache(true)
      webViewRef.current.reload();
    }
  }
  const url = 'https://swap.xucre.net/swap?wallet=xucre';
  return (
    <WebView
      height={'100%'}
      source={{ uri: url }}
      ref={(ref) => {
        if (ref) {
          webViewRef.current = ref
        }
      }}
    />
  )
}