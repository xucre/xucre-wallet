import axios from "axios";

import { env } from './constants';
import { AppWallet } from "./state";
import { BigNumber } from "ethers";
import bitcore, { Networks, Transaction, Address } from 'bitcore-lib'

// const BASEURL = env.BITCOIN_RPC_URL;
const BASEURL = env.REACT_APP_API_URL;
//const BASEURL = 'https://blockstream.info/testnet/api';
// const NETWORK_URL = 'https://nd-442-129-584.p2pify.com/df9cfd721af6d69db80b6607856b2b86';
//const NETWORK_URL = 'https://bitcoin-testnet.drpc.org';
const NETWORK = 'testnet';
//const NETWORK = 'mainnet';

export const getBitcoinBalance = async (wallet: string) => {
  try {
    const instance = axios.create({
      baseURL: `${BASEURL}`,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      url: `bitcoin/balance/?wallet=${wallet}&network=${NETWORK}`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getUTXOs = async (wallet: string) => {
  try {
    const url = `${BASEURL}bitcoin/utxo/?wallet=${wallet}&network=${NETWORK}`;
    //console.log(url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching UTXOs:', JSON.stringify(error));
    return [];
  }
}

export const getRawTransaction = async (txid: string) => {
  try {
    const url = `${BASEURL}bitcoin/tx/?tx=${txid}&network=${NETWORK}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching raw transaction:', JSON.stringify(error));
    return [];
  }

}

export const getFees = async () => {
  try {
    const url = `${BASEURL}bitcoin/fees?network=${NETWORK}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching raw transaction:', JSON.stringify(error));
    return [];
  }

}

export const sendBitcoin = async (transaction: string) => {
  const data = {
    jsonrpc: '1.0',
    id: 1,
    method: 'sendrawtransaction',
    params: [transaction]
  };

  const config = {
    /*auth: {
      username: 'nifty-jones',
      password: 'diaper-math-sister-anchor-rack-caress'
    },*/
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const url = `${BASEURL}bitcoin/tx?network=${NETWORK}` ;
    const response = await axios.post(url, transaction, config);
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending transaction:', error);
    //return null;
    return false;
  }
}

export const validateAddress = async (address: string) => {
  return new bitcore.Address(address);
}

export const constructBitcoinTransaction = async (wallet: bitcore.PrivateKey, to: string, amount: BigNumber, utxos: Transaction.UnspentOutput[], feePerByte: number) => {
  //const btcWallet = ethereumToBitcoinWallet(wallet);
  try {
    //console.log('Sending bitcoin:', wallet.toAddress().toString(), to, amount.toNumber(), utxos);
    //console.log('Sending bitcoin:', wallet.toAddress().toString(), to, amount.toNumber(), utxos);
    // const totalUtxos = utxos.reduce((acc, utxo) => {
    //   //console.log(`utxo amount ${utxo.satoshis}`);
    //   return acc + utxo.satoshis;
    // }, 0);
    //console.log(totalUtxos);
    const transaction = new Transaction()
    .from(utxos)          // Feed information about what unspent outputs one can use
    .to(to, amount.toNumber())  // Add an output with the given amount of satoshis
    //.to(wallet.toAddress().toString(), totalUtxos - amount.toNumber())      // Sets up a change address where the rest of the funds will go
    .feePerKb(feePerByte*1000)       // Sets the fee per kilobyte
    .change(wallet.toAddress().toString())
    //.fee(250)      // Sets up a change address where the rest of the funds will go
    .sign(wallet)     // Signs all the inputs it can
    //console.log(transaction.inspect());
    //transaction._getUnspentValue();
    return transaction;
  } catch (err) {
    console.error('Error sending bitcoin:', err);
    return null;
  }
  
}

export function ethereumToBitcoinWallet(wallet: AppWallet) {
  // Strip the 0x prefix if it exists
  const ethPrivateKeyWithoutPrefix = wallet.wallet.startsWith('0x') ? wallet.wallet.slice(2) : wallet.wallet;

  // Convert the Ethereum private key to WIF (Wallet Import Format) for Bitcoin
  //const ethPk = Buffer.from(ethPrivateKeyWithoutPrefix, 'hex');

  //let hash = bitcore.crypto.Hash.sha256(ethPk);
  //const bun = hash.toString('hex');
  const pk = new bitcore.PrivateKey(ethPrivateKeyWithoutPrefix);
  const pkTestnet = new bitcore.PrivateKey(ethPrivateKeyWithoutPrefix, Networks.testnet);
  
  //console.log(pk.toAddress().toString() , pkTestnet.toAddress().toString());
  return pkTestnet;
}
