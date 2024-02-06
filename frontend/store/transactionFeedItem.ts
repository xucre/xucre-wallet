import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';
import { Token } from "../service/token";
import { CovalentTransactionV3, ParsedTransaction } from "../service/transaction";

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