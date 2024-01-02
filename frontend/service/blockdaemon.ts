import axios from "axios";

import { env, chainIdToNameMap } from './constants';

const APIKEY = env.REACT_APP_BLOCKSPAN_API_KEY;
const BASEURL = env.REACT_APP_BLOCKSPAN_API_URL;

const instance = axios.create({
  baseURL: BASEURL,
  headers: {'x-api-key': APIKEY},
  timeout: 1000,
});

// TODO - Add chainName to non-default

export const getNfts = async (address: string, chainName: string) => {
  try {
    const response = await instance({
      method: 'get',
      url: `nfts/owner/${address}?chain=${chainName}`,
    });
    
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getMetadata = async (contract: any, token: any, chain: any) => {
  try {
    const response = await instance({
      method: 'get',
      url: `nfts/contract/${contract}/token/${token}?chain=${chain}`,
    });
    
    return response.data;
  } catch (error) {
    //
    return {};
  }
}

export const chainIdToNameMapNFT = {
  1: 'eth-main',
  10: 'optimism-main',
  56: 'bsc-main',
  137: 'poly-main',
  42161: 'arbitrum-main',
  80001: 'poly-main',
}