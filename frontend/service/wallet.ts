import { ExternallyOwnedAccount } from "@ethersproject/abstract-signer";
import { defaultPath, entropyToMnemonic, HDNode, Mnemonic } from "@ethersproject/hdnode";
import {  BigNumber, ethers, providers, utils, Wallet, wordlists } from 'ethers';
const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';

const PROVIDER = providers.getDefaultProvider(network);

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

// @ts-ignore
export function loadWalletFromPrivateKey(pk) {
  if (pk.indexOf('0x') !== 0) pk = `0x${pk}`;
  const wallet = new Wallet(pk, PROVIDER);
  return wallet;  
}

export function formatBalance(balance: ethers.BigNumberish) {
  return utils.formatEther(balance);
}

export function reduceBigNumbers(items: any[]) {;
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