/* eslint-disable functional/prefer-readonly-type */
import {
  atom,
} from 'recoil';

import { Network } from './network';


export type AppWallet = {
  address: string,
  name: string,
  wallet: string
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
  default: [] as Network[],
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