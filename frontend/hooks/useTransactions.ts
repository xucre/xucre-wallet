import { useEffect, useState } from 'react';

import { BigNumber, getDefaultProvider, ethers } from 'ethers';
import { getNftJson, getTokenBalances, getTokenTransferHistory, getWalletTransactions } from '../service/api';
import { CovalentTokenHistoryItem } from '../types/token';
import { CovalentTransactionV3 } from '../service/transaction';
import { useRecoilValue } from 'recoil';
import { activeNetwork, activeWallet } from '../service/state';
import { chainIdToNameMap, testWallet } from '../service/constants';
import { getFeedItems, storeFeedItems } from '../store/transactionFeedItem';

function useTransactions() {
  const [transactionsTotal, setTransactions] = useState({} as {[key:number] : CovalentTransactionV3[]});
  const [transactionsRefreshing, setTransactionsRefreshing] = useState(false);
  const transactions = Object.values(transactionsTotal).length > 0 ? Object.values(transactionsTotal).flatMap((tList) => tList).reduce((finalVal, currentVal) => {
    if (finalVal.find((f) => f.tx_hash === currentVal.tx_hash)) return finalVal;
    return [...finalVal, currentVal];
  }, [] as CovalentTransactionV3[]) as CovalentTransactionV3[] : [] as CovalentTransactionV3[];
  const wallet = useRecoilValue(activeWallet);
  //const network = useRecoilValue(activeNetwork);
  
  const sync = async (save: boolean, chainId: number) => {
    if (save) setTransactionsRefreshing(true);
    //const walletAddress = __DEV__ ? testWallet : wallet.address;
    const walletAddress = wallet.address;
    const _transactions = await getWalletTransactions(walletAddress, chainIdToNameMap[chainId as keyof typeof chainIdToNameMap]);
    if (save && _transactions && _transactions.covalent && _transactions.covalent.items) {
      setTransactions(previousValue => { return { ...previousValue, [chainId]: _transactions.covalent.items as CovalentTransactionV3[] } });
      setTransactionsRefreshing(false);
    }

    return _transactions && _transactions.covalent ? _transactions.covalent.items as CovalentTransactionV3[] : [] as CovalentTransactionV3[];
  }

  const reset = () => {
    Object.keys(chainIdToNameMap).forEach(async (chainId) => {
      if (chainId === '0') return;
      sync(true, Number(chainId));
    });
  }
  useEffect(() => {
    let isMounted = true;
    const runAsync = async (chainId: number) => {
      //const walletAddress = __DEV__ ? testWallet : wallet.address;
      const walletAddress = wallet.address;
      const _existingItems = await getFeedItems(walletAddress, chainId);
      if (_existingItems && _existingItems?.length > 0) {
        if (isMounted) {
          setTransactions(previousValue => { return { ...previousValue, [chainId]: _existingItems } });
          setTransactionsRefreshing(false);
        }
      }
      const _transactions = await sync(false, chainId);
      if (isMounted && _transactions) {
        setTransactions(previousValue => { return { ...previousValue, [chainId]: _transactions } });
        setTransactionsRefreshing(false);
        storeFeedItems(walletAddress, chainId, transactions);
      }
    }
    Object.keys(chainIdToNameMap).forEach(async (chainId) => {
      if (chainId === '0') return;
      runAsync(Number(chainId));
    });
    return () => {
      isMounted = false;
    };
  }, [])

  return { transactions, transactionsTotal, refreshing: transactionsRefreshing, reset };
}

export default useTransactions;