
import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useRecoilState, useRecoilValue } from 'recoil';
import translations from "../../../assets/translations";

import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../../service/state";
import { useMixpanel } from '../../../hooks/useMixpanel';

export default function Ubeswap({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const [loading, setLoading] = useState(false);
  const mixpanel = useMixpanel();
  const [language,] = useRecoilState(stateLanguage);
  const [_walletList,] = useRecoilState(walletList);
  const [_wallet,] = useRecoilState(activeWallet);
  useEffect(() => {
    mixpanel.track("view_page", { "page": "Ubeswap", "dApp": 'https://app.ubeswap.org' });
  });

  //const url = 'https://app.uniswap.org/#/swap';
  let webViewRef: any = useRef(null);
  const onRefresh = () => {
    if (webViewRef.current) {

      webViewRef.current.clearCache(true)
      webViewRef.current.reload();
    }
  }
  const url = 'https://app.ubeswap.org/#/swap';
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