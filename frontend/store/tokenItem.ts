
import EncryptedStorage from 'react-native-encrypted-storage';
import { Token, TokenPrice } from "../service/token";

export const storeTokenItems = async (walletAddress: string, chainId: number, list: Token[]) => {
  await EncryptedStorage.setItem(
    `tokens:${walletAddress}:${chainId}`,
    JSON.stringify(list)
  );
};

export const getTokenItems = async (walletAddress: string,  chainId: number) => {
  const list = await EncryptedStorage.getItem(`tokens:${walletAddress}:${chainId}`);
  if (!list) {
    return null;
  }
  return JSON.parse(list as string) as any[];
}

export const storeTokenPriceMap = async (walletAddress: string, chainId: number, list: {[key: string]: TokenPrice}) => {
  await EncryptedStorage.setItem(
    `tokenPrices:${walletAddress}:${chainId}`,
    JSON.stringify(list)
  );
};

export const getTokenPriceMap = async (walletAddress: string,  chainId: number) => {
  const list = await EncryptedStorage.getItem(`tokenPrices:${walletAddress}:${chainId}`);
  if (!list) {
    return null;
  }
  return JSON.parse(list as string) as any;
}