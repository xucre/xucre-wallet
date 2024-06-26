
import { Text, useColorMode } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useMemo, useState } from 'react';
//import { renderToString } from 'react-dom/server';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRecoilState } from 'recoil';


import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../../service/state";
import { rampUrl } from '../../../service/api';

export default function UnlimitWidget({ navigation, route }: { navigation: { navigate: Function }, route: any }) {

  const { colorMode } = useColorMode();
  const [network,] = useRecoilState(activeNetwork);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet,] = useRecoilState(activeWallet);

  const url = rampUrl(colorMode as string);
  return (
    <>
      <WebView
        source={{ uri: url }}
      />
    </>
  )
}
