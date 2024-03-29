
import { Text } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useMemo, useState } from 'react';
//import { renderToString } from 'react-dom/server';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRecoilState } from 'recoil';


import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../service/state";

export default function BuyToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {


  const [network,] = useRecoilState(activeNetwork);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet,] = useRecoilState(activeWallet);
  useEffect(() => {
    const runAsync = async () => {

    }
    if (network) {
      runAsync();
    }

  }, [network])

  const url = 'https://app.uniswap.org/#/tokens/ethereum';
  return (
    <>
      <WebView
        source={{ uri: url }}
      />
    </>
  )
}
