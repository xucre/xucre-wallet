import { defaultPath, entropyToMnemonic, HDNode, Mnemonic } from "@ethersproject/hdnode";
import { BigNumber, providers, utils, Wallet, wordlists } from 'ethers';
const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';

const PROVIDER = providers.getDefaultProvider(network);

export function generateMnemonics(language) {
  //return entropyToMnemonic(utils.randomBytes(16)).split(' ');
  const langVal = language === 'en' || language === 'es' ? language : 'es';
  return Wallet.createRandom({ locale: wordlists[langVal] }).mnemonic.phrase.split(' ');
}

export function loadWalletFromMnemonics(mnemonics) {
  if (mnemonics instanceof Array) mnemonics = mnemonics.join(' ');

  const wallet = Wallet.fromMnemonic(mnemonics);
  return wallet;
}

export function loadWalletFromPrivateKey(pk) {
  if (pk.indexOf('0x') !== 0) pk = `0x${pk}`;
  return new Wallet(pk, PROVIDER);  
}

export function formatBalance(balance) {
  return utils.formatEther(balance);
}

export function reduceBigNumbers(items) {;
  return items.reduce((prev, next) => prev.add(next), BigNumber.from('0'));
}

export function calculateFee({ gasUsed, gasPrice }) {
  return gasUsed * Number(formatBalance(gasPrice));
}

export function estimateFee({ gasLimit, gasPrice }) {
  return BigNumber.from(String(gasLimit)).mul(String(gasPrice));
}