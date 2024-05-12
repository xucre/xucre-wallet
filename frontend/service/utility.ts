import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { env } from './constants';
import { ExtendedBalance, Holding, OpenQuotes, OutputObject } from '../types/history';
import dayjs from 'dayjs';
import { ethers } from 'ethers';

//Static References

export const ipfsGateway = env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
//const contract = new Contract(wethContractAddress, wethInterface);

export const formatString = function(args: string[]) {
  const arg = Array.prototype.slice.call(args, 1);
  return args[0].replace(/{(\d+)}/g, function(match: any, number: string | number) { 
    return typeof arg[number  as keyof typeof arg] != 'undefined'
      ? arg[number as keyof typeof arg] 
      : match
    ;
  });
  
}

export const cleanImageUrl = async (uri: string) => {
  if (uri.includes('ipfs') && uri.includes('/image')) {
    const imageResponse = await fetch(ipfsGateway+uri.replace('ipfs://', ''));
    const image = await imageResponse.text();
    if(image.startsWith('data')) {
      return image;
    } else {
      return ipfsGateway+uri.replace('ipfs://', '');
    }
  } else if (uri.includes('ipfs')) {
    return ipfsGateway+uri.replace('ipfs://', '');
  } else {
    return uri;
  }  
}

export const fetchIPNS = async (metadataUri: string | string[]) => {
  if (metadataUri !== 'ipfs:///metadata.json') {
    if (metadataUri && !metadataUri.includes('ipns')) {
      const metadataRequest = await fetch("https://ipfs.io"+metadataUri);
      return await metadataRequest.json();      
    }
  } else {
    return {}
  }
}

export const urlCheck = (websiteUrl: any) => { 
  const urlRegEx = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/);
    return urlRegEx.test(String(websiteUrl).toLowerCase());
}

const truncateStringBase = (str: string, num: number) => {
  if (str.length > 10) {
    return str.substr(0, num) + '...' + str.substr(-(num));
  }
  return str;
}

export const truncateString = (str: string, num: number, addDots = true) => {
  return truncateStringBase(str,num);
}

export const truncateStringStart = (str: string, num: number, addDots = true) => {
  return truncateStringBase(str,num);
}

export const truncateString_old = (str: string, num: number, addDots = true) => {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str) {
    if (str.length <= num) {
      return str
    }
    // Return str truncated with '...' concatenated to the end of str.
    if (addDots) {
      return str.slice(0, num) + '...'
    } else {
      return str.slice(0, num)
    }
  }
  
  
}

export const truncateStringStart_old = (str: string, num: number) => {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return '...' + str.slice(-num) 
}

export const PromiseHelperAllSettled = (promises: any[]) => {
  return Promise.all(promises.map(function (promise: Promise<any>) {
      return promise.then(function (value: any) {
          return { state: 'fulfilled', value: value };
      }).catch(function (reason: any) {
          return { reason: reason, state: 'rejected'};
      });
  }));
};

export const convertDollarAmountToCurrency = (dollarValue: number, conversionRate: number) => {
  return conversionRate * dollarValue;
}

export const processCovalentJsonData = (jsonData: { error: any; data: { items: any[]; }; } | null, tokenAddress: string | null) => {
  const conversionRate = 1;
  const currency = 'USD';
  const output: OutputObject = {
    isTokenValue: false,
    itemsWithRecentOpenQuote: [],
    openQuotesByDay: [],
  };

  if (jsonData === null || jsonData.error) {
    return {quotes: [], isReady: true};
  }

  jsonData.data.items.forEach((item) => {
    let mostRecentOpenQuote: ExtendedBalance | null = null;
    if ((tokenAddress && compareAddresses(item.contract_address, tokenAddress)) || !tokenAddress) {
      const decimals = item.contract_decimals;
      const tickerSymbol = item.contract_ticker_symbol;
      item.holdings.forEach((holding: Holding) => {
        const date = dayjs(holding.timestamp);
        if (holding.open) {
          const existingEntry = output.openQuotesByDay.find((entry) => dayjs(entry.date).isSame(date, 'day'));
          if (holding.open.quote === null) {
            output.isTokenValue = true;
          }
          if (existingEntry) {
            existingEntry.totalQuote += holding.open.quote || Number(ethers.utils.formatUnits(holding.open.balance, decimals));
            existingEntry.quoteRate = holding.quote_rate || 1;
            existingEntry.isTokenValue = holding.open.quote === null;
          } else {
            output.openQuotesByDay.push({
              date: date.format('MM/DD/YYYY'), 
              totalQuote: holding.open.quote || Number(ethers.utils.formatUnits(holding.open.balance, decimals)),
              quoteRate: holding.quote_rate || 1,
              isTokenValue: holding.open.quote === null,
            });
          }

          if (!mostRecentOpenQuote || mostRecentOpenQuote.timestamp as number < parseFloat(holding.timestamp)) {
            mostRecentOpenQuote = holding.open;
          }
        }
      });

      if (mostRecentOpenQuote) {
        output.itemsWithRecentOpenQuote.push({
          contract: {
            address: item.contract_address,
            name: item.contract_name,
            ticker_symbol: item.contract_ticker_symbol,
          },
          mostRecentOpenQuote,
        });
      }
    }
  });
  const isReady = output === null || output.openQuotesByDay[0].totalQuote === null || output.openQuotesByDay[0].totalQuote === 0;

  const openQuotes = output.openQuotesByDay.reduce((finalVal, d, _i) => {
    return {
      ...finalVal,
      quotes: [...finalVal.quotes, d]
    } as OpenQuotes;
  }, {
    direction: 'down',
    quotes: []
  } as OpenQuotes)
  
  const finalQuotes = openQuotes.quotes.map((d) => {
    const finalQuote = {
      meta: {
        'date': d.date
      },
      x: d.date.length > 0 ? dayjs(d.date, "MM/DD/YYYY").unix() : dayjs().unix(),
      y: Math.round(((d.totalQuote * conversionRate) + Number.EPSILON) * 100) / 100
    };
    return finalQuote
  });

  return {quotes: finalQuotes, isReady: isReady, isTokenValue: output.isTokenValue, openQuotes: openQuotes};
}

export const isSVGFormatImage = (url: string) => {
  return url.endsWith(".svg");
}

export const compareAddresses = (address1: string, address2: string) => {
  if (ethers.utils.getAddress(address2) === ethers.constants.AddressZero) {
    return ethers.utils.getAddress(address1) === ethers.utils.getAddress('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') || ethers.utils.getAddress(address1) === ethers.utils.getAddress('0x0000000000000000000000000000000000001010');
  }
  return ethers.utils.getAddress(address1) === ethers.utils.getAddress(address2);
}

export function waitms(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}