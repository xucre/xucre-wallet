//import { SwapWidget } from '@uniswap/widgets'
//import '@uniswap/widgets/fonts.css';
//import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { ethers, getDefaultProvider, providers, Wallet } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';

import { activeNetwork, activeWallet, networkList, language as stateLanguage, tokenList, transactionList, walletList } from "../../service/state";

export default function SwapToken({navigation, route}) {
  const [network, ] = useRecoilState(activeNetwork);
  const [language, ] = useRecoilState(stateLanguage);  
  const [_wallet, ] = useRecoilState(activeWallet);
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
  return (
    <></>
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