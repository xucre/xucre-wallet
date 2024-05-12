import { BigNumber, Wallet } from 'ethers';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AppWallet } from '../service/state';

export class WalletInternal extends Wallet {
  name: string | undefined;
} 

export const storeWallet = async (wallet: AppWallet) => {
  const _wallets = await EncryptedStorage.getItem("wallet_list");
  if (!_wallets && wallet) {
    await EncryptedStorage.setItem(
      "wallet_list",
      JSON.stringify([wallet])
    );
    await storeActiveWallet(wallet);
  } else if (wallet) {
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
  }
  
};

export const getWallets = async () => {
  const _wallets = await EncryptedStorage.getItem('wallet_list')
  if (!_wallets) {
    return [];
  }
  try {
    const regular = JSON.parse(_wallets as string) as AppWallet[];
    return regular;
  } catch (err) {
    const oldVersion = JSON.parse(_wallets as string) as WalletInternal[];
    const newVersion = oldVersion.map((old) => {
      return {
        name: old.name,
        address: old.address,
        wallet: old.privateKey
      } as AppWallet;
    });
    await EncryptedStorage.setItem('wallet_list',JSON.stringify(newVersion));
    return newVersion;
  }
  
}

export const getActiveWallet = async () => {  
  const _wallet = await EncryptedStorage.getItem('active_wallet')
  if (!_wallet) {
    return undefined;
  }
  return JSON.parse(_wallet as string);
}

export const storeActiveWallet = async (wallet: AppWallet) => {
  if (!wallet) return;
  await EncryptedStorage.setItem(
    "active_wallet",
    JSON.stringify([wallet])
  );
}