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

//const lifi = new LIFI();

export default function BuyToken({ navigation, route }) {

  console.log('route ', route);
  console.log('navigation ', navigation);

  const [network,] = useRecoilState(activeNetwork);
  const [language,] = useRecoilState(stateLanguage);
  const [_wallet,] = useRecoilState(activeWallet);
  const [wallet, setWallet] = useState({} as Wallet);
  const [provider, setProvider] = useState({} as ethers.providers.JsonRpcProvider);
  useEffect(() => {
    if (_wallet.name != '' && network) {
      const _provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
      setProvider(_provider);
      const newWallet = _wallet.wallet.connect(_provider);
      setWallet(newWallet);
    }
  }, [_wallet, network]);

  useEffect(() => {
    const runAsync = async () => {
      //const chains = await lifi.getChains();
      const chains = [];
      console.log(chains[0]);
      const chain = chains.find((val) => {
        console.log(val.id, network.chainId);
        return val.id === network.chainId
      })
      console.log(chain);
      //console.log(await lifi.getTokens({chains: [chains[0].id]}));
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