/* eslint-disable functional/prefer-readonly-type */
import ethers, {Wallet} from 'ethers';
import React, {useEffect, useRef, useState} from "react";
import {
  atom,
  useRecoilState
} from 'recoil';

import { constructDefaultNetworks } from "../service/network"
import { getNetworks, storeNetworks} from "../store/network";

import { Network } from './network';


  const runAsync = async () => {
    const _networks = await getNetworks();
    //await storeNetworks([])
    if (!Array.isArray(_networks) || _networks.length === 0) {
      const _newNetworks = constructDefaultNetworks();
        console.log('_newNetworks ::: ', _newNetworks)
      const currentNetwork = await storeNetworks(_newNetworks);
      console.log('currentNetwork :: ', currentNetwork)
      
    } 
      
  }



export type AppWallet = {
  address: string,
  name: string,
  wallet: Wallet
}

export const walletList = atom({
  default: [] as AppWallet[], 
  key: 'walletList',
});

export const activeWallet = atom({
  default: {
    address: '',
    name: '',
    wallet: {}
  } as AppWallet,
  key: 'activeWallet'
});

export const language = atom({
  default : 'en',
  key: 'language'
});

export const networkList = atom({
  default: [],
  key: 'networkList'
});

export const activeNetwork = atom({
  default: {
    blockExplorer: 'https://etherscan.io',
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'wss://eth-mainnet.g.alchemy.com/v2/JqOD3cdBDl50H65bk315fAE614CDHa9u',
    symbol: 'ETH',
  } as Network,
  key: 'activeNetwork'
}) 


/* export const activeNetwork = atom({
  default: {
    blockExplorer: net[0].blockExplorer,
    chainId: net[0].chainId,
    name: net[0].name,
    rpcUrl: net[0].rpcUrl,
    symbol: net[0].symbol,
  } as Network,
  key: 'activeNetwork'
})  */

export const selectedNetwork = atom({
  default: {
    blockExplorer: '',
    chainId: 0,
    name: '',
    rpcUrl: '',
    symbol: '',
  } as Network,
  key: 'selectedNetwork'
})

export const tokenList = atom({
  default: [],
  key: 'tokenList'
});

export const transactionList = atom({
  default: [],
  key: 'transactionList'
});

export const activeTransaction = atom({
  default: {
    chainId: 0,
    transactionHash: ''
  },
  key: 'activeTransaction'
})

export const lastUnlockDate = atom({
  default: null,
  key: 'lastUnlockDate'
})