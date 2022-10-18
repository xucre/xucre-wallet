import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

export const storeWallet = async (wallet) => {
  const _wallets = await EncryptedStorage.getItem("wallet_list");
  const wallets = JSON.parse(_wallets);
  if (Array.isArray(wallets)) {
    await EncryptedStorage.setItem(
      "wallet_list",
      JSON.stringify([...wallets, wallet])
    );
  } else {
    await EncryptedStorage.setItem(
      "wallet_list",
      JSON.stringify([wallet])
    );
  }
};

export const getWallets = async () => {
  const _wallets = await EncryptedStorage.getItem('wallet_list')
  return JSON.parse(_wallets);
}

