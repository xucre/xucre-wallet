/* eslint-disable functional/prefer-readonly-type */
import ethers, {Wallet} from 'ethers';
import {
  atom,
} from 'recoil';

export type AppWallet = {
  name: string,
  wallet: Wallet
}

export const walletList = atom({
  default: [] as AppWallet[], 
  key: 'walletList',
});

export const activeWallet = atom({
  default: {
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
    blockExplorer: '',
    chainId: 0,
    name: '',
    rpcUrl: '',
    symbol: '',
  },
  key: 'activeNetwork'
})

export const selectedNetwork = atom({
  default: {
    blockExplorer: '',
    chainId: 0,
    name: '',
    rpcUrl: '',
    symbol: '',
  },
  key: 'selectedNetwork'
})

export const tokenList = atom({
  default: [],
  key: 'tokenList'
});
