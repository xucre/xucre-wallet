import axios from "axios";

import { env } from './constants';
import { Toast } from "native-base";

const BASEURL = env.REACT_APP_API_URL;
//const url = 'https://nasty-bears-grab.loca.lt/swap?wallet=xucre&color=';
const url = 'https://swap.xucre.net';
export const swapUrl = (color: string) => `${url}/swap?wallet=xucre&color=${color}`;

export const rampUrl = (color: string) => `${url}/ramp?wallet=xucre&color=${color}`;
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
      timeout: 100000,
      headers: {'Content-Type': 'application/json'}
    });
    const response = await instance.get(`tokens`,{
      params: {
        chainName,
        wallet,
      },
    });    
    return response.data;
  } catch (error) {
    console.log(chainName, error);
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

export const getTokenTransferHistory = async (wallet: string, token: string, chainName: any) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 10000,
    });
    const response = await instance({
      method: 'get',
      params: {
        chainName,
        wallet,
        token,
      },
      url: `tokens/transfer`,
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

export const createGoogleWalletPass = async (payload: {address: string, pk: string, email?: string}) => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 10000,
    });
    const response = await instance({
      data: payload,
      method: 'post',
      url: `google`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export const getTokenPrices = async (chainId: number, addresses: String[]) => {
  //conversion
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 10000,
    });
    //if (chainId === 20090103) console.log(addresses.join(','));
    const response = await instance({
      method: 'get',
      url: `price?chainId=${chainId}&addresses=${addresses.join(',')}`,
    });
    //if (chainId === 20090103) console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log(error);
    Toast.show({title: 'Failed to fetch token prices', description: `${chainId}`});
    return [];
  }
}

export const getConversionRate = async (currency: string) => {
  //conversion
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 10000,
    });
    const response = await instance({
      method: 'get',
      url: `conversion?currency=${currency}`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}