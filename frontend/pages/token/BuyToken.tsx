
import { Text, useColorMode } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useMemo, useRef, useState } from 'react';
//import { renderToString } from 'react-dom/server';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRecoilState } from 'recoil';


import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../service/state";
import { rampUrl } from '../../service/api';
import DappHeader from '../../components/dapp/DappHeader';

export default function BuyToken({ navigation, route }: { navigation: { navigate: Function }, route: any }) {

  const { colorMode } = useColorMode();
  const [network,] = useRecoilState(activeNetwork);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet,] = useRecoilState(activeWallet);
  let webViewRef: any = useRef(null);
  const url = rampUrl(colorMode as string);
  return (
    <>
      <DappHeader navigation={navigation} webViewRef={webViewRef} page={'BuyToken'} />
      <WebView
        source={{ uri: url }}
        ref={(ref) => {
          if (ref) {
            webViewRef.current = ref
          }
        }}
      />
    </>
  )
}
