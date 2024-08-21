import { useEffect, useMemo, useState } from 'react';

import { BigNumber, getDefaultProvider, ethers } from 'ethers';
import { getWalletTransactions } from '../service/api';
import { CovalentTokenHistoryItem } from '../types/token';
import { CovalentTransactionV3, ParsedTransaction, parseTransaction } from '../service/transaction';
import { useRecoilValue } from 'recoil';
import { activeNetwork, activeWallet } from '../service/state';
import { chainIdToNameMap, testWallet } from '../service/constants';
import { getFeedItems, storeFeedItems } from '../store/transactionFeedItem';
import { WalletInternal } from '../store/wallet';
import { chainIdToNetworkMap } from '../service/network';

function useTransactions() {
  const [transactionsTotal, setTransactions] = useState({} as {[key:number] : CovalentTransactionV3[]});
  const [parsedTransactionsTotal, setParsedTransactions] = useState({} as {[key:number] : ParsedTransaction[]});
  const [transactionsRefreshing, setTransactionsRefreshing] = useState(false);

  const parsedTransactions = useMemo(() => {
    return Object.values(parsedTransactionsTotal).length > 0 ? Object.values(parsedTransactionsTotal).flatMap((tList) => tList).reduce((finalVal, currentVal) => {
    if (finalVal.find((f) => f.transactionId === currentVal.transactionId)) return finalVal;
    return [...finalVal, currentVal];
  }, [] as ParsedTransaction[]) as ParsedTransaction[] : [] as ParsedTransaction[];
}, [parsedTransactionsTotal]);

  const transactions = useMemo(() => {
      return Object.values(transactionsTotal).length > 0 ? Object.values(transactionsTotal).flatMap((tList) => tList).reduce((finalVal, currentVal) => {
      if (finalVal.find((f) => f.tx_hash === currentVal.tx_hash)) return finalVal;
      return [...finalVal, currentVal];
    }, [] as CovalentTransactionV3[]) as CovalentTransactionV3[] : [] as CovalentTransactionV3[];
  }, [transactionsTotal]);

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

    const returnVal = _transactions && _transactions.covalent ? _transactions.covalent.items as CovalentTransactionV3[] : [] as CovalentTransactionV3[];

    return returnVal;
  }

  const reset = () => {
    let isMounted = true;
    setTransactionsRefreshing(true);
    const runAsync = async (chainId: number) => {
      //const walletAddress = __DEV__ ? testWallet : wallet.address;
      const walletAddress = wallet.address;
      const _transactions = await sync(false, chainId);
      if (isMounted && _transactions) {
        setTransactions(previousValue => { return { ...previousValue, [chainId]: _transactions } });
        setTransactionsRefreshing(false);
        storeFeedItems(walletAddress, chainId, transactions);
      }
      const _parsedTransactions = await parseTransactions(_transactions, chainId);
      if (isMounted && _parsedTransactions) {
        setParsedTransactions(previousValue => { return { ...previousValue, [chainId]: _parsedTransactions } });
      }
    }
    Object.keys(chainIdToNameMap).forEach(async (chainId) => {
      if (chainId === '0') return;
      runAsync(Number(chainId));
    });
  }

  const parseTransactions = async (transactions: CovalentTransactionV3[], chainId: number) => {
    if (transactions && transactions.length > 0) {
      const networks = chainIdToNetworkMap();
      const provider = getDefaultProvider(networks[chainId].rpcUrl);
      const _wallet = new WalletInternal(wallet.wallet);
      const _parsedTransactions = await Promise.all(transactions.map(async (transaction) => {   
        try {
          const result: ParsedTransaction = await parseTransaction(_wallet, transaction, chainId, provider);
          return { ...result, covalentData: transaction };
        } catch (err) {
          return {} as ParsedTransaction;
        }
      }));
      return _parsedTransactions;
    }
    return [] as ParsedTransaction[];
  };

  useEffect(() => {
    let isMounted = true;
    const runAsync = async (chainId: number) => {
      //const walletAddress = __DEV__ ? testWallet : wallet.address;
      const walletAddress = wallet.address;
      const _existingItems = await getFeedItems(walletAddress, chainId);
      if (_existingItems && _existingItems?.length > 0 && isMounted) {
        //console.log(`existing items ${chainId} ${_existingItems.length}`);
        setTransactions(previousValue => { return { ...previousValue, [chainId]: _existingItems } });
        setTransactionsRefreshing(false);        
      }
      const _transactions = await sync(false, chainId);
      if (isMounted && _transactions) {
        setTransactions(previousValue => { return { ...previousValue, [chainId]: _transactions } });
        setTransactionsRefreshing(false);
        storeFeedItems(walletAddress, chainId, transactions);
        parseTransactions(_transactions, chainId);
      }
      const _parsedTransactions = await parseTransactions(_transactions, chainId);
      if (isMounted && _parsedTransactions) {
        setParsedTransactions(previousValue => { return { ...previousValue, [chainId]: _parsedTransactions } });
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

  return { transactions, transactionsTotal, parsedTransactions, parsedTransactionsTotal, refreshing: transactionsRefreshing, reset };
}

export default useTransactions;