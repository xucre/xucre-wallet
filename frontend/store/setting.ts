import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

export const storeTheme = async (mode) => {
  await EncryptedStorage.setItem(
    "theme_mode",
    mode
  );
};

export const getTheme = async () => {
  const theme = await EncryptedStorage.getItem('theme_mode')
  return theme;
}
 