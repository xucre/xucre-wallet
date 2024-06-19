
import EncryptedStorage from 'react-native-encrypted-storage';
import { Token, TokenPrice } from "../service/token";
import { AlchemyMetadata } from '../types/token';

export const storeTokenItems = async (walletAddress: string, chainId: number, list: Token[]) => {
  await EncryptedStorage.setItem(
    `tokens:${walletAddress}:${chainId}`,
    JSON.stringify(list)
  );
};

export const getTokenItems = async (walletAddress: string,  chainId: number) => {
  const list = await EncryptedStorage.getItem(`tokens:${walletAddress}:${chainId}`);
  if (!list) {
    return [] as Token[];
  }
  return JSON.parse(list as string) as Token[];
}

export const storeTokenPriceMap = async (walletAddress: string, chainId: number, list: {[key: string]: TokenPrice}) => {
  try {
    await EncryptedStorage.setItem(
      `tokenPrices:${walletAddress}:${chainId}`,
      JSON.stringify(list)
    );
  } catch (err) {
  }
};

export const getTokenPriceMap = async (walletAddress: string,  chainId: number) => {
  const list = await EncryptedStorage.getItem(`tokenPrices:${walletAddress}:${chainId}`);
  if (!list) {
    return {} as {[key: string]: TokenPrice};
  }
  return JSON.parse(list as string) as {[key: string]: TokenPrice};
}

export const storeTokenMetadata = async (tokenAddress: string, chainId: number, metadata: AlchemyMetadata) => {
  try {
    await EncryptedStorage.setItem(
      `tokenMetadata:${tokenAddress}:${chainId}`,
      JSON.stringify(metadata)
    );
  } catch (err) {
    console.log('storeTokenMetadata error');
  }
}

export const retrieveTokenMetadata = async (tokenAddress: string, chainId: number) => {
  const metadata = await EncryptedStorage.getItem(`tokenMetadata:${tokenAddress}:${chainId}`);
  if (!metadata) {
    return {} as AlchemyMetadata;
  }
  return JSON.parse(metadata as string) as AlchemyMetadata;
}

export const storeTokenSpamState = async (tokenAddress: string, chainId: number, state: boolean) => {
  try {
    await EncryptedStorage.setItem(
      `tokenSpamState:${tokenAddress}:${chainId}`,
      JSON.stringify(state)
    );
  } catch (err) {
  }
}

export const retrieveTokenSpamState = async (tokenAddress: string, chainId: number) => {
  const metadata = await EncryptedStorage.getItem(`tokenSpamState:${tokenAddress}:${chainId}`);
  if (!metadata) {
    return false;
  }
  return metadata === 'true';
}