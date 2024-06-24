/* eslint-disable functional/prefer-readonly-type */
import {
  atom,
} from 'recoil';

import { constructDefaultNetworks, Network } from './network';
import { ConversionRate } from '../types/conversionRate';
import { getConversionRateStore } from '../store/setting';
import { loadActiveWallet, loadWallets } from './wallet';
import { getActiveNetwork } from '../store/network';
import { getLanguage } from '../store/language';
import { getAllTokenPrices, getAllTokens, Token, TokenPrice } from './token';


export type AppWallet = {
  address: string,
  name: string,
  wallet: string
}

export const walletList = atom({
  default: [] as AppWallet[], 
  key: 'walletList',
  effects: [
    ({ setSelf }) => {
    loadWallets().then((value) => {
      setSelf(value);
    })}
  ]
});

export const activeWallet = atom({
  default: {
    address: '',
    name: '',
    wallet: {}
  } as AppWallet,
  key: 'activeWallet',
  effects: [
    ({ setSelf }) => {
      loadActiveWallet().then((value) => {
      setSelf(value);
    })}
  ]
});

export const language = atom({
  default : 'en',
  key: 'language',
  effects: [
    ({ setSelf }) => {
      getLanguage().then((value) => {
      setSelf(value);
    })}
  ]
});

export const networkList = atom({
  default: [] as Network[],
  key: 'networkList',
  effects: [
    ({ setSelf }) => {
      setSelf(constructDefaultNetworks());
    }
  ]
});

export const activeNetwork = atom({
  default: {
    blockExplorer: 'https://etherscan.io',
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'wss://eth-mainnet.g.alchemy.com/v2/JqOD3cdBDl50H65bk315fAE614CDHa9u',
    symbol: 'ETH',
  } as Network,
  key: 'activeNetwork',
  effects: [
    ({ setSelf }) => {
    getActiveNetwork().then((value) => {
      setSelf(value);
    })}
  ]
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

export const tokenTotal = atom({
 default: {} as {[key:number] : Token[]},
 key: 'tokenTotal',
 effects:[
  ({ setSelf }) => {
    getAllTokens().then((value) => {
      setSelf(value);
    })}
 ] 
})

export const tokenPricesTotal = atom({
  default: {} as { [key:number] : {
    [key: string]: TokenPrice
  }},
  key: 'tokenPrices',
  effects:[
   ({ setSelf }) => {
    getAllTokenPrices().then((value) => {
      setSelf(value);
    })}
  ] 
 })

export const tokenList = atom({
  default: [],
  key: 'tokenList',
  effects: [
    ({ setSelf }) => {
    getActiveNetwork().then((value) => {
      //setSelf(value);
    })}
  ]
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

export const conversionRateState = atom({
  default: {value: 1, currency: 'USD'} as ConversionRate,
  key: 'conversionRate',
  effects: [
    ({ setSelf }) => {
    getConversionRateStore().then((value) => {
      setSelf(value);
    })}
  ]
})
