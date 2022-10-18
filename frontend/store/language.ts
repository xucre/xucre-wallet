import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

export const storeLanguage = async (language) => {
  await EncryptedStorage.setItem(
    "language",
    language
  );
};

export const getLanguage = async () => {
  return await EncryptedStorage.getItem('language')
}

