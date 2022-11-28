import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { env } from './constants';

//Static References

export const ipfsGateway = env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
//const contract = new Contract(wethContractAddress, wethInterface);

export const formatString = function(args) {
  const arg = Array.prototype.slice.call(args, 1);
  return args[0].replace(/{(\d+)}/g, function(match, number) { 
    return typeof arg[number] != 'undefined'
      ? arg[number] 
      : match
    ;
  });
  
}

export const cleanImageUrl = async (uri) => {
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

export const fetchIPNS = async (metadataUri) => {
  if (metadataUri !== 'ipfs:///metadata.json') {
    if (metadataUri && !metadataUri.includes('ipns')) {
      const metadataRequest = await fetch("https://ipfs.io"+metadataUri);
      return await metadataRequest.json();      
    }
  } else {
    return {}
  }
}

export const urlCheck = (websiteUrl) => { 
  const urlRegEx = new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/);
    return urlRegEx.test(String(websiteUrl).toLowerCase());
}

export const truncateString = (str, num) => {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + '...'
}

export const truncateStringStart = (str, num) => {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return '...' + str.slice(-num) 
}

export const PromiseHelperAllSettled = (promises) => {
  return Promise.all(promises.map(function (promise) {
      return promise.then(function (value) {
          return { state: 'fulfilled', value: value };
      }).catch(function (reason) {
          return { reason: reason, state: 'rejected'};
      });
  }));
};
