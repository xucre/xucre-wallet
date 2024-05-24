
import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useRecoilState, useRecoilValue } from 'recoil';


import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../../service/state";
import { WalletInternal } from '../../../store/wallet';
import { useIsFocused } from '@react-navigation/core';
import { Token } from '../../../service/token';
import { getActiveNetwork } from '../../../store/network';
import { useMixpanel } from '../../../hooks/useMixpanel';

export default function EthicHub({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const mixpanel = useMixpanel();
  const [language,] = useRecoilState(stateLanguage);
  const [_walletList,] = useRecoilState(walletList);
  const [_wallet,] = useRecoilState(activeWallet);

  useEffect(() => {
    mixpanel.track("view_page", { "page": "EthicHub", "dApp": 'https://ethix.ethichub.com' });
  })

  let webViewRef: any = useRef(null);
  const onRefresh = () => {
    if (webViewRef.current) {

      webViewRef.current.clearCache(true)
      webViewRef.current.reload();
    }
  }
  const url = 'https://ethix.ethichub.com/stake';
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