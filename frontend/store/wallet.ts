import { BigNumber, Wallet } from 'ethers';
import EncryptedStorage from 'react-native-encrypted-storage';

export class WalletInternal extends Wallet {
  name: string | undefined;
} 

export const storeWallet = async (wallet: WalletInternal) => {
  const _wallets = await EncryptedStorage.getItem("wallet_list");
  const wallets = JSON.parse(_wallets as string);
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
  return JSON.parse(_wallets as string);
}

export const getActiveWallet = async () => {  
  const _wallet = await EncryptedStorage.getItem('active_wallet')
  return JSON.parse(_wallet as string);
}

export const storeActiveWallet = async (wallet: WalletInternal) => {
  await EncryptedStorage.setItem(
    "active_wallet",
    JSON.stringify([wallet])
  );
}