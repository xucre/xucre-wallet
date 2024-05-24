
import { ethers, getDefaultProvider, providers, Wallet } from 'ethers';
import { ScrollView, Text, useColorMode } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useRef, useState } from 'react';
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
import { useMixpanel } from '../../hooks/useMixpanel';

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
  const mixpanel = useMixpanel();

  useEffect(() => {
    const runAsync = async () => {
      await mixpanel.track("view_page", { "page": "Swap Token", "dApp": 'https://swap.xucre.net' });
    }
    runAsync();
  }, [isFocused])
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