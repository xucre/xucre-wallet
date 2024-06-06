import EncryptedStorage from 'react-native-encrypted-storage';
import { HistoryStore } from '../types/history';

export const storeWalletHistory = async (wallet: string, chainId: number, history: HistoryStore) => {
  await EncryptedStorage.setItem(
    `walletHistory:${wallet}:${chainId}`,
    JSON.stringify(history)
  );
};

export const retrieveWalletHistory = async (wallet: string, chainId: number) => {
  const histories = await EncryptedStorage.getItem(`walletHistory:${wallet}:${chainId}`);
  if (histories) {
    return JSON.parse(histories) as HistoryStore;
  }
  return null;
}

