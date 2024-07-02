import { useEffect, useState } from 'react';

import { getTokenTransferHistory, getWalletHistory } from '../service/api';
import { CovalentTokenHistoryItem } from '../types/token';
import { useRecoilValue } from 'recoil';
import { activeNetwork, activeWallet } from '../service/state';
import { chainIdToNameMap, testWallet } from '../service/constants';
import { getTokenHistoryItems, storeTokenHistoryItems } from '../store/token';
import { ChartData, HistoryStore, mergeChartData, TrendData } from '../types/history';
import dayjs from 'dayjs';
import { processCovalentJsonData } from '../service/utility';
import { retrieveWalletHistory, storeWalletHistory } from '../store/history';

function useWalletHistory() {
  const [currentHoldingsTotal, setCurrentHoldings] = useState({} as {[key:number] : ChartData});
  const currentHoldings = Object.values(currentHoldingsTotal).length > 0 ? Object.values(currentHoldingsTotal).reduce((finalVal, _currentHolding) => {
    return _currentHolding ? { x: _currentHolding.x, y: _currentHolding.y+Number(finalVal.y || '0'), meta: { date: _currentHolding.meta.date } } : finalVal;
  }, {} as ChartData) : {} as ChartData;

  const [chartDataTotal, setChartData] = useState({} as {[key:number] : ChartData[]});
  const chartData = Object.values(chartDataTotal).length > 0 ? mergeChartData(Object.values(chartDataTotal).flatMap((tList) => tList)) : [] as ChartData[];
  
  const [isZeroData, setIsZeroData] = useState(false);
  const [secondToLastHoldingsTotal, setSecondToLastHoldings] = useState({} as {[key:number] : TrendData});
  const _secondToLastHoldings = Object.values(secondToLastHoldingsTotal).length > 0 ? Object.values(secondToLastHoldingsTotal).reduce((finalVal, _secondToLastHolding) => {
    return _secondToLastHolding ? { y: (Number(_secondToLastHolding.y)+Number(finalVal.y || 0)).toString(), percent: _secondToLastHolding.percent, trend: _secondToLastHolding.trend, numerator: finalVal.numerator + _secondToLastHolding.numerator, denominator: finalVal.denominator + _secondToLastHolding.denominator } : finalVal;
  }, {} as TrendData) : {} as TrendData;
  const secondToLastHoldings = {..._secondToLastHoldings, percent: ((_secondToLastHoldings.numerator / _secondToLastHoldings.denominator) || 0).toFixed(0) + '%', trend : Number(_secondToLastHoldings.y) > currentHoldings.y ? 'up' : Number(_secondToLastHoldings.y) < currentHoldings.y ? 'down' : 'flat'} as TrendData;
  const [refreshing, setIsRefreshing] = useState(false);

  const wallet = useRecoilValue(activeWallet);
  //const network = useRecoilValue(activeNetwork);
  
  const sync = async (save: boolean, chainId: number) => {
    if (save) setIsRefreshing(true);
    try {
      //const walletAddress = __DEV__ ? testWallet : wallet.address;
      const walletAddress = wallet.address;
      const chainName = chainIdToNameMap[chainId as keyof typeof chainIdToNameMap] || 'eth-mainnet';
      const historyResults = await getWalletHistory(walletAddress, chainName);
      const { openQuotes: _finalQuotes, isReady } = processCovalentJsonData(historyResults, null);
      if (_finalQuotes && _finalQuotes.quotes.length > 0) {
        const finalQuotes = _finalQuotes.quotes;
        const quoteMap = finalQuotes.sort((a, b) => dayjs(a.date, 'MM/DD/YYYY').isBefore(dayjs(b.date, 'MM/DD/YYYY')) ? 1 : -1).reduce((returnVal, d) => {
          if (returnVal[d.date]) {
            if (!d.isTokenValue) {
              return { ...returnVal, [d.date]: { ...returnVal[d.date], y: returnVal[d.date].y + d.totalQuote,  } }
            }
            return returnVal;
          }
          if (!d.isTokenValue) {
            const _d = dayjs(d.date, 'MM/DD/YYYY')
            return { ...returnVal, [d.date]: { x: _d.unix(), y: d.totalQuote, meta: {date: _d.format('MM-DD-YYYY')} } };
          }
          return returnVal;
        }, {} as { [key: string]: ChartData });
        
        const _quotes = Object.values(quoteMap);
        const _chartData = _quotes.length > 7 ? _quotes.splice(0, 7) : _quotes;
        const lastQuote = {..._chartData[_chartData.length - 1]};
        const secondToLastQuote = _chartData[_chartData.length - 2];
        const numerator = secondToLastQuote.y - lastQuote.y;
        const denominator = _chartData[0].y;
        const percent = ((numerator / denominator) || 0).toFixed(0) + '%';
        const trend = secondToLastQuote.y > lastQuote.y ? 'up' : secondToLastQuote.y < lastQuote.y ? 'down' : 'flat';
        const y = (secondToLastQuote.y - lastQuote.y).toFixed(2) || '';
        if (save) {
          setCurrentHoldings(previousValue => { return { ...previousValue, [chainId]: lastQuote } });
          setSecondToLastHoldings(previousValue => { return { ...previousValue, [chainId]: { percent, trend, y, numerator, denominator } } });
          setIsRefreshing(false);
          setChartData(previousValue => { return { ...previousValue, [chainId]: _chartData } });
          setIsZeroData(isReady)
        }
      
        return {
          currentHoldings: lastQuote, 
          secondToLastHoldings: { percent, trend, y: y } as TrendData, 
          isZeroData: isReady, 
          chartData: _chartData
        } as HistoryStore
      }
      if (save) setIsRefreshing(false);
      return {} as HistoryStore;
    } catch (err: any) {
      return {} as HistoryStore
    }
    
  }

  const reset = () => {
    //sync(true);
    Object.keys(chainIdToNameMap).forEach(async (chainId) => {
      if (chainId === '0') return;
      sync(true, Number(chainId));
    });
  }

  const isValid = () => {
    return chartData && chartData.length > 0 && currentHoldings.x 
  }

  useEffect(() => {
    let isMounted = true;
    //const walletAddress = __DEV__ ? testWallet : wallet.address;
    const walletAddress = wallet.address;
    const getData = async (chainId:number) => {
      try {
        const _existingItems = await retrieveWalletHistory(walletAddress, chainId)
        if (_existingItems && !_existingItems.isZeroData && _existingItems.chartData && _existingItems.chartData.length > 0) {
          if (isMounted) {
            setCurrentHoldings(previousValue => { return { ...previousValue, [chainId]: _existingItems.currentHoldings } });
            setSecondToLastHoldings(previousValue => { return { ...previousValue, [chainId]: _existingItems.secondToLastHoldings } });
            setIsRefreshing(false);
            setChartData(previousValue => { return { ...previousValue, [chainId]: _existingItems.chartData } });
            setIsZeroData(previousValue => previousValue || _existingItems.isZeroData)
          }
        }
      } catch (err) {
        // first time error
      }
      const _data = await sync(false, chainId);

      if (isMounted && _data) {
        setCurrentHoldings(previousValue => { return { ...previousValue, [chainId]: _data.currentHoldings } });
        setSecondToLastHoldings(previousValue => { return { ...previousValue, [chainId]: _data.secondToLastHoldings } });
        setIsRefreshing(false);
        setChartData(previousValue => { return { ...previousValue, [chainId]: _data.chartData } });
        setIsZeroData(previousValue => previousValue || _data.isZeroData)
      }
      if (_data) storeWalletHistory(walletAddress, chainId, _data);
    }
    if (walletAddress) {
      Object.keys(chainIdToNameMap).forEach((chainId) => {
        if (chainId === '0') return;
        getData(Number(chainId))
      });
    }
    return () => { isMounted = false }
  }, [wallet])

  return { currentHoldings, chartData, isZeroData, secondToLastHoldings, chartDataTotal, currentHoldingsTotal, refreshing, reset };
}

export default useWalletHistory;