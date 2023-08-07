import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

import { Transaction } from "../service/transaction";

export const addTransaction = async (item: Transaction) => {
  const _list = await EncryptedStorage.getItem("transaction_list");
  const list = JSON.parse(_list) as readonly Transaction[];
  if (Array.isArray(list)) {
    await EncryptedStorage.setItem(
      "transaction_list",
      JSON.stringify([...list, item])
    );
  } else {
    await EncryptedStorage.setItem(
      "transaction_list",
      JSON.stringify([item])
    );
  }
};

export const updateTransaction = async (item: Transaction) => {
  //console.log('update transaction: ', item.hash);
  const _list = await EncryptedStorage.getItem("transaction_list");
  const list = JSON.parse(_list) as readonly Transaction[];
  if (Array.isArray(list)) {
    const newTransactionList = list.map((_item) => {
      //console.log(_item.hash, item.hash);
      if (_item.hash === item.hash) {
        const mergeItem = {...item, submitDate: _item.submitDate};
        return mergeItem;
      } else {
        return _item;
      }
    });
    await EncryptedStorage.setItem(
      "transaction_list",
      JSON.stringify(newTransactionList)
    );
  } else {
    await EncryptedStorage.setItem(
      "transaction_list",
      JSON.stringify([item])
    );
  }
};

export const storeTransactions = async (list: readonly Transaction[]) => {
  await EncryptedStorage.setItem(
    "transaction_list",
    JSON.stringify(list)
  );
};

export const storeActiveTransaction = async (item: Transaction) => {
  //console.log('store active item');
  await EncryptedStorage.setItem(
    "active_transaction",
    JSON.stringify(item)
  );
};

export const getActiveTransaction = async () => {
  const item = await EncryptedStorage.getItem('active_transaction');
  return JSON.parse(item) as Transaction;
}

export const getTransactions = async () => {
  const list = await EncryptedStorage.getItem('transaction_list');
  return JSON.parse(list) as readonly Transaction[];
}

export const getTransactionsByChainAndWallet = async (chainId, address) => {
  const list = await EncryptedStorage.getItem('transaction_list');
  const _list = JSON.parse(list) as readonly Transaction[];
  if (_list && Array.isArray(_list)) {
    return _list.filter((_transaction: Transaction) => {
      return _transaction.chainId === chainId && _transaction.from === address;
    })
  } else {
    const placeholder = [] as readonly Transaction[];
    return placeholder;
  }
  
  
}