import axios, { AxiosResponse } from "axios";

import { env } from './constants';

const BASEURL = env.REACT_APP_API_URL;

export const getNftJson = async () => {
  try {
    const instance = axios.create({
      baseURL: BASEURL,
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      url: `nfts`,
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
      timeout: 1000,
    });
    const response = await instance({
      method: 'get',
      params: {
        chainName,
        wallet,
      },
      url: `transactions`,
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

  export const conversionTokens = (cValue: string) => {
    //Main Params
    const valueToConvert = 'https://pgoh3ugkwf7bg4avrcwe5yts7e0epnon.lambda-url.sa-east-1.on.aws/conversion?currency=' + cValue
    async function endPoint(): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(valueToConvert)
            return response.data
        } catch (error) {
            console.log('error ', error)
        }
    }

    return endPoint(


