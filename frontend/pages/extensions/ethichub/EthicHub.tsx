
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useRecoilState, useRecoilValue } from 'recoil';


import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../../service/state";
import { WalletInternal } from '../../../store/wallet';
import { useIsFocused } from '@react-navigation/core';
import { Token } from '../../../service/token';
import { getActiveNetwork } from '../../../store/network';

export default function EthicHub({ navigation, route }: { navigation: { navigate: Function }, route: any }) {

  const [language,] = useRecoilState(stateLanguage);
  const [_walletList,] = useRecoilState(walletList);
  const [_wallet,] = useRecoilState(activeWallet);

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