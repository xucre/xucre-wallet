import { useEffect, useState } from 'react';

import { getTokenTransferHistory } from '../service/api';
import { CovalentTokenHistoryItem } from '../types/token';
import { useRecoilValue } from 'recoil';
import { activeNetwork, activeWallet } from '../service/state';
import { chainIdToNameMap } from '../service/constants';
import { getTokenHistoryItems, storeTokenHistoryItems } from '../store/token';

function useTokenHistory(tokenAddress = "" as string) {
  const [transactions, setTransactions] = useState([] as CovalentTokenHistoryItem[]);
  const [transactionsRefreshing, setTransactionsRefreshing] = useState(false);
  
  const wallet = useRecoilValue(activeWallet);
  const network = useRecoilValue(activeNetwork);
  
  const sync = async (save: boolean) => {
    if (save) setTransactionsRefreshing(true);
    const _transactions = await getTokenTransferHistory(wallet.address, tokenAddress, chainIdToNameMap[network.chainId as keyof typeof chainIdToNameMap]);
    if (save) {
      setTransactions(_transactions);
      setTransactionsRefreshing(false);
    }
    return _transactions;
  }

  const reset = () => {
    sync(true);
  }
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      const _existingItems = await getTokenHistoryItems(wallet.address, tokenAddress, network.chainId)
      if (_existingItems && _existingItems?.length > 0) {
        if (isMounted) {
          setTransactions(_existingItems as CovalentTokenHistoryItem[]);
          setTransactionsRefreshing(false);
        }
      }
      const _transactions = await sync(false);

      if (isMounted) {
        setTransactions(_transactions as CovalentTokenHistoryItem[]);
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
      if (isMounted) storeTokenHistoryItems(wallet.address, tokenAddress, network.chainId, transactions);
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

export default useTokenHistory;