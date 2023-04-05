import axios from "axios";

import { env } from './constants';

const APIKEY = env.REACT_APP_BLOCKSPAN_API_KEY;
const BASEURL = env.REACT_APP_BLOCKSPAN_API_URL;

const instance = axios.create({
  baseURL: BASEURL,
  headers: {'x-api-key': APIKEY},
  timeout: 1000,
});

export const getNfts = async (address) => {
  try {
    const response = await instance({
      method: 'get',
      url: `nfts/owner/${address}`,
    });
    //console.log(response);
    return response.data;
  } catch (error) {
    //console.error(error);
    return null;
  }
}

export const getMetadata = async (contract, token, chain) => {
  try {
    const response = await instance({
      method: 'get',
      url: `nfts/contract/${contract}/token/${token}?chain=${chain}`,
    });
    //console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
}