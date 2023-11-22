//import LIFI, {ChainId} from '@lifi/sdk';
import { ethers, getDefaultProvider, providers, Wallet } from 'ethers';
import { Text } from 'native-base';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import React, { useEffect, useMemo, useState } from 'react';
//import { renderToString } from 'react-dom/server';
//import { WebView } from "react-native-webview";
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRecoilState } from 'recoil';


import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../service/state";
import { WalletInternal } from '../../store/wallet';

//const lifi = new LIFI();

export default function SwapToken({ navigation, route }: {navigation: {navigate: Function}, route: any}) {
  const [network,] = useRecoilState(activeNetwork);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet,] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.JsonRpcProvider);
  useEffect(() => {
    if (_wallet.name != '' && network) {
      const _provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      setProvider(_provider);
      const newWallet = new WalletInternal(_wallet.wallet).connect(_provider);
      setWallet(newWallet);
    }
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
      //const chains = await lifi.getChains();
    }
    if (network) {
      runAsync();
    }

  }, [network])

  const url = 'https://app.uniswap.org/#/swap';
  return (
    <>
      <WebView
        source={{ uri: url }}
      />
    </>
  )
}

//<SwapWidget provider={provider} />
//<LiFiWidget config={widgetConfig} ></LiFiWidget>
/*
const widgetConfig: WidgetConfig = {
  containerStyle: {
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '16px',
  },
  integrator: 'Xucre',
};
*/