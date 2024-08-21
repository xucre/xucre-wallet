
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
import { ethereumToBitcoinWallet } from '../../service/bitcoin';

export default function BuyTokenBTC({ navigation, route }: { navigation: { navigate: Function }, route: any }) {

  const { colorMode } = useColorMode();
  const [network,] = useRecoilState(activeNetwork);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet,] = useRecoilState(activeWallet);
  let webViewRef: any = useRef(null);
  if (!_wallet) return <Text fontSize={'md'} color={colorMode === 'dark' ? 'coolGray.400' : 'dark.300'} >{translations[language as keyof typeof translations].ui.address_not_found}</Text>
  const address = ethereumToBitcoinWallet(_wallet).toAddress().toString();
  const url = `${rampUrl(colorMode as string)}&address=${address}`;
  return (
    <>
      <DappHeader navigation={navigation} webViewRef={webViewRef} page={'BuyTokenBTC'} />
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
