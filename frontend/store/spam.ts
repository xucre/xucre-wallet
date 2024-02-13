import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';
import { Token } from "../service/token";

export const addToSpam = async (tokenAddress: string, chainId: number, token : Token) => {
  if (tokenAddress.length > 0) {
    await EncryptedStorage.setItem(
      `spam:${chainId}:${tokenAddress.toLowerCase()}`,
      JSON.stringify(token)
    );
    //
  }
};

export const isSpam = async (tokenAddress: string, chainId: number) => {
  if (tokenAddress.length > 0) {
    const spamRecord = await EncryptedStorage.getItem(`spam:${chainId}:${tokenAddress.toLowerCase()}`);
    return spamRecord === null ? false : true;
  }

  return false;
}

