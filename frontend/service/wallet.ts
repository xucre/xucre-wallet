import { ExternallyOwnedAccount } from "@ethersproject/abstract-signer";
import { defaultPath, entropyToMnemonic, HDNode, Mnemonic } from "@ethersproject/hdnode";
import {payments} from "bitcoinjs-lib";
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import {ECPairFactory} from "ecpair"
import {  BigNumber, ethers, providers, utils, Wallet, wordlists } from 'ethers';
import { AppWallet } from "./state";
import { getActiveWallet, getWallets } from "../store/wallet";
const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';

const PROVIDER = providers.getDefaultProvider(network);
const ECPair = ECPairFactory(ecc);

export function generateMnemonics(language: string) {
  //return entropyToMnemonic(utils.randomBytes(16)).split(' ');
  const langVal = language === 'en' ? language : 'es';
  try {
    
    //const nWallet = Wallet.createRandom({ locale: ethers.wordlists['es'] });
    const newWallet = Wallet.createRandom({ locale: wordlists.en });
    //if (langVal === 'en') {
      return newWallet.mnemonic.phrase.split(' ');
    //} 
    //const wallet = Wallet.createRandom({ locale: wordlists.es })
    //const wallet = ethers.Wallet.fromMnemonic(newWallet.mnemonic.phrase, newWallet.mnemonic.path, ethers.wordlists[langVal]);
    //eturn wallet.mnemonic.phrase.split(' ');
    //return []
  } catch (err) {
    return [];
  }
  
}

export function loadWalletFromMnemonics(mnemonics: string | any[]) {
  if (mnemonics instanceof Array) mnemonics = mnemonics.join(' ');

  const wallet = Wallet.fromMnemonic(mnemonics);
  return wallet;
}

export function ethereumToBitcoinWallet(wallet: AppWallet) {
  // Strip the 0x prefix if it exists
  const ethPrivateKeyWithoutPrefix = wallet.wallet.startsWith('0x') ? wallet.wallet.slice(2) : wallet.wallet;

  // Convert the Ethereum private key to WIF (Wallet Import Format) for Bitcoin
  const privateKeyBuffer = Buffer.from(ethPrivateKeyWithoutPrefix, 'hex');
  //const keyPair = wif.decodeRaw(privateKeyBuffer);
  const keyPair = ECPair.fromPrivateKey(privateKeyBuffer);
  
  // Generate the Bitcoin address
  return payments.p2pkh({ pubkey: keyPair.publicKey });
  //return address;
}

// @ts-ignore
export function loadWalletFromPrivateKey(pk) {
  if (pk.indexOf('0x') !== 0) pk = `0x${pk}`;
  const wallet = new Wallet(pk, PROVIDER);
  return wallet;  
}

export function formatBalance(balance: ethers.BigNumberish) {
  return utils.formatEther(balance);
}

export function reduceBigNumbers(items: any[]) {
  if (!items) return BigNumber.from(0);
  return items.reduce((prev: { add: (arg0: any) => any; }, next: any) => prev.add(next), BigNumber.from('0'));
}

export function calculateFee({ gasUsed, gasPrice }: {gasUsed: number, gasPrice: number}) {
  return gasUsed * Number(formatBalance(gasPrice));
}

export function estimateFee({ gasLimit, gasPrice }: {gasLimit: number, gasPrice: number}) {
  return BigNumber.from(String(gasLimit)).mul(String(gasPrice));
}

export async function exportWallet(pk : string) {

}

export async function loadWallets() {
  const _wallets = await getWallets();
  if (Array.isArray(_wallets) && _wallets.length > 0) {
    const loadedWallets = _wallets.map((val) => {
      const wallet = loadWalletFromPrivateKey(val.wallet);
      const _bitcoinWallet = ethereumToBitcoinWallet(val);
      //console.log('bitcoin wallet address', _bitcoinWallet.address);
      if (wallet) {
        return { address: wallet.address, name: val.name, wallet: wallet.privateKey };
      }
    });
    if (loadedWallets) {
      return loadedWallets as AppWallet[];
    }
  } 

  return [] as AppWallet[];
}

export async function loadActiveWallet() {
  const _wallet2 = await getActiveWallet();
  if (_wallet2 && _wallet2.length > 0) {
    return _wallet2[0];
  }
  return {
    address: '',
    name: '',
    wallet: {}
  } as AppWallet;
}