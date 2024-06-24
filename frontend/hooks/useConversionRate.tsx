import React, { useEffect, useState } from 'react';
import { ConversionRate } from '../types/conversionRate';
import { getConversionRate } from '../service/api';
import { getConversionRateStore, storeConversionRate } from '../store/setting';
import { conversionRateState } from '../service/state';
import { useRecoilState } from 'recoil';

export const useConversionRate = () => {
  const [conversionRate, updateConversionRate] = useRecoilState(conversionRateState)
  //const [_conversionRate, setConversionRate] = useState<ConversionRate | null>(null);

  const setCurrency = async (currency: string) => {
    const price = await getConversionRate(currency);
    const newRate = { currency, value: price };
    await storeConversionRate(newRate);
    //setConversionRate({ ...newRate });
    updateConversionRate({ ...newRate });
  };

  /*useEffect(() => {
    let isMounted = true;

    const runAsync = async () => {
      const rate = await getConversionRateStore();
      if (isMounted) {
        setConversionRate(rate);
        updateConversionRate(rate);
      }

      const price = await getConversionRate(rate.currency);
      const _conversionRate = { ...rate, value: price };
      if (isMounted) {
        setConversionRate(_conversionRate);
      }
    }

    runAsync();

    return () => {
      isMounted = false;
    };
  }, []);*/

  return { conversionRate, setCurrency };
};