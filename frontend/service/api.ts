import axios from "axios";

import { env } from './constants';

const BASEURL = env.REACT_APP_API_URL;
export const swapUrl = 'https://swap.xucre.net/';

export const getNftJson = async (type: string) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      url: `v2/nfts`,
      params: {
        type
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getIconImageUrl = (iconName: string) => {
  return BASEURL + 'icon?icon='+iconName;
}

export const getIconImage = async (iconName: any) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      params: {
        icon: iconName
      },
      url: `icon`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getWalletHistory = async (wallet: string, chainName: string) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      params: {
        chainName,
        wallet,
      },
      url: `history`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getWalletTransactions = async (wallet: string, chainName: any) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 10000,
    });
    const response = await instance({
      method: 'get',
      params: {
        chainName,
        wallet: wallet.toLowerCase(),
      },
      url: `transactions`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getTokenBalances = async (wallet: string, chainName: any) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      params: {
        chainName,
        wallet,
      },
      url: `tokens`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getTokenMetadata = async (address: string, chainName: any) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      params: {
        chainName,
        address,
      },
      url: `tokens/metadata`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}


export const getIsSpam = async (address: string, chainId: number) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      params: {
        address,
        chainId,
      },
      url: `spam`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const callWhatsApp = async (payload: any) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      data: payload,
      method: 'post',
      url: `whatsapp`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getWhatsAppToken = async () => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      url: `whatsapp`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}