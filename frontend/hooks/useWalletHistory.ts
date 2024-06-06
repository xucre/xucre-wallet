import { useEffect, useState } from 'react';

import { getTokenTransferHistory, getWalletHistory } from '../service/api';
import { CovalentTokenHistoryItem } from '../types/token';
import { useRecoilValue } from 'recoil';
import { activeNetwork, activeWallet } from '../service/state';
import { chainIdToNameMap } from '../service/constants';
import { getTokenHistoryItems, storeTokenHistoryItems } from '../store/token';
import { ChartData, HistoryStore, TrendData } from '../types/history';
import dayjs from 'dayjs';
import { processCovalentJsonData } from '../service/utility';
import { retrieveWalletHistory, storeWalletHistory } from '../store/history';

function useWalletHistory() {
  const [currentHoldings, setCurrentHoldings] = useState({
    meta: {
      'date': '01/01/2024'
    },
    x: 0,
    y: 0
  } as ChartData);
  //const [holdings, setHoldings] = useState([] as ItemsWithOpenQuote[]);
  const [chartData, setChartData] = useState([] as ChartData[]);
  const [isZeroData, setIsZeroData] = useState(false);
  const [secondToLastHoldings, setSecondToLastHoldings] = useState({
    percent: '0%',
    trend: 'flat',
    y: '0.00',
  } as TrendData)
  const [refreshing, setIsRefreshing] = useState(false);

  const wallet = useRecoilValue(activeWallet);
  const network = useRecoilValue(activeNetwork);
  const chainName = chainIdToNameMap[network.chainId as keyof typeof chainIdToNameMap] || 'eth-mainnet';
  
  const sync = async (save: boolean) => {
    if (save) setIsRefreshing(true);
    try {
      const historyResults = await getWalletHistory(wallet.address, chainName);
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
        /*const quoteMap = finalQuotes.sort((a, b) => a.x - b.x).reduce((returnVal, d) => {
          if (returnVal[d.x]) {
            return { ...returnVal, [d.x]: { ...returnVal[d.x], y: returnVal[d.x].y + d.y } }
          }
          return { ...returnVal, [d.x]: d };
        }, {} as { [key: number]: ChartData });*/
        
        const _quotes = Object.values(quoteMap);
        //console.log(quoteMap);
        const _chartData = _quotes.length > 7 ? _quotes.reverse().splice(0, 7) : _quotes.reverse();
        const lastQuote = {..._chartData[_chartData.length - 1]};
        const secondToLastQuote = _chartData[_chartData.length - 2];
        const percent = (((secondToLastQuote.y - lastQuote.y) / _chartData[0].y) || 0).toFixed(0) + '%';
        const trend = secondToLastQuote.y > lastQuote.y ? 'up' : secondToLastQuote.y < lastQuote.y ? 'down' : 'flat';
        const y = (secondToLastQuote.y - lastQuote.y).toFixed(2);
        if (save) {
          setCurrentHoldings(lastQuote);
          setSecondToLastHoldings({ percent, trend, y: y || '' });
          setIsRefreshing(false);
          setChartData(_chartData);
          setIsZeroData(isReady)
        }
        

        return {
          currentHoldings: lastQuote, 
          secondToLastHoldings: { percent, trend, y: y } as TrendData, 
          isZeroData: isReady, 
          chartData: _chartData
        } as HistoryStore
      }
    } catch (err: any) {
      return {} as HistoryStore
    }
    if (save) setIsRefreshing(false);
  }

  const reset = () => {
    sync(true);
  }

  const isValid = () => {
    return chartData && chartData.length > 0 && currentHoldings.x 
  }

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const _existingItems = await retrieveWalletHistory(wallet.address, network.chainId)
        if (_existingItems && !_existingItems.isZeroData && _existingItems.chartData && _existingItems.chartData.length > 0) {
          if (isMounted) {
            setCurrentHoldings(_existingItems.currentHoldings);
            setSecondToLastHoldings(_existingItems.secondToLastHoldings);
            setChartData(_existingItems.chartData || []);
            setIsZeroData(_existingItems.isZeroData);
            setIsRefreshing(false);
          }
        }
      } catch (err) {
        // first time error
      }
      

      const _data = await sync(false);
      if (isMounted && _data) {
        setCurrentHoldings(_data.currentHoldings);
        setSecondToLastHoldings(_data.secondToLastHoldings);
        setChartData(_data.chartData);
        setIsZeroData(_data.isZeroData);
      }
      if (_data) storeWalletHistory(wallet.address, network.chainId, _data);
    }
    if (wallet.address && network) {
      getData();
    }
    return () => { isMounted = false }
  }, [wallet, chainName, network])

  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      if (isMounted && isValid()) storeWalletHistory(wallet.address, network.chainId, {chartData, currentHoldings, isZeroData, secondToLastHoldings} as HistoryStore);
    }
    if (chartData && chartData.length > 0) {
      runAsync();
    }
    return () => {
      isMounted = false;
    }
  }, [currentHoldings, chartData, isZeroData, secondToLastHoldings])


  return { currentHoldings, chartData, isZeroData, secondToLastHoldings, refreshing, reset };
}

export default useWalletHistory;