
import EncryptedStorage from 'react-native-encrypted-storage';
import { Token } from "../service/token";
import { CovalentTransactionV3, ParsedTransaction } from "../service/transaction";
import { CovalentTokenHistoryItem } from '../types/token';

export const storeFeedItems = async (walletAddress: string, chainId: number, list: CovalentTransactionV3[]) => {
  await EncryptedStorage.setItem(
    `transactions:${walletAddress}:${chainId}`,
    JSON.stringify(list)
  );
};

export const getFeedItems = async (walletAddress: string,  chainId: number) => {
  const list = await EncryptedStorage.getItem(`transactions:${walletAddress}:${chainId}`);
  if (!list) {
    return null;
  }
  return JSON.parse(list as string) as CovalentTransactionV3[];
};

export const storeParsedTransaction = async (walletAddress: string,  chainId: number, transaction: ParsedTransaction) => {
  await EncryptedStorage.setItem(
    `parsedTransaction:${walletAddress}:${chainId}:${transaction.transactionId}`,
    JSON.stringify(transaction)
  );
}

export const getParsedTransaction = async (walletAddress: string,  chainId: number, transactionId: string) => {
  const list = await EncryptedStorage.getItem(`parsedTransaction:${walletAddress}:${chainId}:${transactionId}`);
  if (!list) {
    return null;
  }
  return JSON.parse(list as string) as ParsedTransaction;
};

export const storeCovalentTokenHistoryItem = async (walletAddress: string,  chainId: number, transactions: CovalentTokenHistoryItem[]) => {
  await EncryptedStorage.setItem(
    `covalentTokenHistoryItem:${walletAddress}:${chainId}`,
    JSON.stringify(transactions)
  );
}

export const getCovalentTokenHistoryItem = async (walletAddress: string,  chainId: number) => {
  const list = await EncryptedStorage.getItem(`covalentTokenHistoryItem:${walletAddress}:${chainId}`);
  if (!list) {
    return null;
  }
  return JSON.parse(list as string) as CovalentTokenHistoryItem[];
};