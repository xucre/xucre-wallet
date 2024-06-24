import axios from "axios";

import { env } from './constants';
import { AppWallet } from "./state";
import { BigNumber } from "ethers";

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

export const sendBitcoin = async (wallet: AppWallet, to: string, amount: BigNumber) => {}
