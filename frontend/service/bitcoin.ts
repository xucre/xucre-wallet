import axios from "axios";

import { env } from './constants';

const BASEURL = env.BITCOIN_RPC_URL;

export const getBitcoinBalance = async (wallet: string) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      url: `address/${wallet}`
    });
    return response.data;
  } catch (error) {
    return null;
  }
}
