import axios from "axios";

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

export const getIconImageUrl = (iconName) => {
  return BASEURL + 'icon?icon='+iconName;
}

export const getIconImage = async (iconName) => {
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

export const getWalletHistory = async (wallet, chainName) => {
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

export const callWhatsApp = async (payload) => {
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