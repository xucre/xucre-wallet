import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { env } from './constants';
import { ExtendedBalance, Holding, OutputObject } from '../types/history';

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

export const processJsonData = (jsonData: { error: any; data: { items: any[]; }; } | null) => {
  const output: OutputObject = {
    isTokenValue: false,
    itemsWithRecentOpenQuote: [],
    openQuotesByDay: [],
  };

  if (jsonData === null || jsonData.error) {
    return output;
  }

  jsonData.data.items.forEach((item) => {
    let mostRecentOpenQuote: ExtendedBalance | null = null;

    item.holdings.forEach((holding: Holding) => {
      const date = holding.timestamp.split("T")[0];
      if (holding.open) {
        const existingEntry = output.openQuotesByDay.find((entry) => entry.date === date);

        if (existingEntry) {
          existingEntry.totalQuote += holding.open.quote;
          existingEntry.quoteRate = holding.quote_rate;
        } else {
          output.openQuotesByDay.push({
            date, totalQuote: holding.open.quote,
            quoteRate: holding.quote_rate
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
  });

  return output;
}

export const isSVGFormatImage = (url: string) => {
  return url.endsWith(".svg");
}
