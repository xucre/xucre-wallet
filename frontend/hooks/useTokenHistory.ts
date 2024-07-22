import { useEffect, useState } from 'react';

import { getTokenTransferHistory } from '../service/api';
import { CovalentTokenHistoryItem } from '../types/token';
import { useRecoilValue } from 'recoil';
import { activeNetwork, activeWallet } from '../service/state';
import { chainIdToNameMap } from '../service/constants';
import { getTokenHistoryItems, storeTokenHistoryItems } from '../store/token';

function useTokenHistory(tokenAddress = "" as string, chainId = 1 as number) {
  const [transactions, setTransactions] = useState([] as CovalentTokenHistoryItem[]);
  const [transactionsRefreshing, setTransactionsRefreshing] = useState(false);
  
  const wallet = useRecoilValue(activeWallet);
  //const network = useRecoilValue(activeNetwork);
  
  const sync = async (save: boolean) => {
    if (save) setTransactionsRefreshing(true);
    const _transactions = await getTokenTransferHistory(wallet.address, tokenAddress, chainIdToNameMap[chainId as keyof typeof chainIdToNameMap]);
    if (save) {
      setTransactions(_transactions.items as CovalentTokenHistoryItem[]);
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
      const _existingItems = await getTokenHistoryItems(wallet.address, tokenAddress, chainId)
      if (_existingItems && _existingItems?.length > 0) {
        if (isMounted) {
          setTransactions(_existingItems as CovalentTokenHistoryItem[]);
          //setTransactionsRefreshing(false);
        }
      }
      const _transactions = await sync(false);
      if (isMounted) {
        setTransactions(_transactions.items as CovalentTokenHistoryItem[]);
        setTransactionsRefreshing(false);
        storeTokenHistoryItems(wallet.address, tokenAddress, chainId, _transactions.items as CovalentTokenHistoryItem[]);
      }
    }
    runAsync();
    return () => {
      isMounted = false;
    };
  }, [])

  // useEffect(() => {
  //   let isMounted = true;
  //   const runAsync = async () => {
  //     if (isMounted) storeTokenHistoryItems(wallet.address, tokenAddress, chainId, transactions);
  //   }
  //   if (transactions && transactions.length > 0) {
  //     //runAsync();
  //   }
  //   return () => {
  //     isMounted = false;
  //   }
  // }, [transactions])


  return { transactions, refreshing: transactionsRefreshing, reset };
}

export default useTokenHistory;