import { useEffect, useState } from 'react';

import { BigNumber, getDefaultProvider, ethers } from 'ethers';
import { getNftJson, getTokenBalances, getTokenTransferHistory, getWalletTransactions } from '../service/api';
import { CovalentTokenHistoryItem } from '../types/token';
import { CovalentTransactionV3 } from '../service/transaction';
import { useRecoilValue } from 'recoil';
import { activeNetwork, activeWallet } from '../service/state';
import { chainIdToNameMap } from '../service/constants';
import { getFeedItems, storeFeedItems } from '../store/transactionFeedItem';

function useTransactions() {
  const [transactions, setTransactions] = useState([] as CovalentTransactionV3[]);
  const [transactionsRefreshing, setTransactionsRefreshing] = useState(false);
  
  const wallet = useRecoilValue(activeWallet);
  const network = useRecoilValue(activeNetwork);
  
  const sync = async (save: boolean) => {
    if (save) setTransactionsRefreshing(true);
    const _transactions = await getWalletTransactions(wallet.address, chainIdToNameMap[network.chainId as keyof typeof chainIdToNameMap]);
    if (save && _transactions && _transactions.covalent.items) {
      setTransactions(_transactions.covalent.items as CovalentTransactionV3[]);
      setTransactionsRefreshing(false);
    }
    return _transactions.covalent.items as CovalentTransactionV3[];
  }

  const reset = () => {
    sync(true);
  }
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _existingItems = await getFeedItems(wallet.address, network.chainId);
      if (_existingItems && _existingItems?.length > 0) {
        if (isMounted) {
          setTransactions(_existingItems as CovalentTransactionV3[]);
          setTransactionsRefreshing(false);
        }
      }
      const _transactions = await sync(false);
      if (isMounted && _transactions) {
        setTransactions(_transactions);
        setTransactionsRefreshing(false);
      }
    }
    runAsync();
    return () => {
      isMounted = false;
    };
  }, [])

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      if (isMounted) storeFeedItems(wallet.address, network.chainId, transactions);
    }
    if (transactions && transactions.length > 0) {
      runAsync();
    }
    return () => {
      isMounted = false;
    }
  }, [transactions])


  return { transactions, refreshing: transactionsRefreshing, reset };
}

export default useTransactions;