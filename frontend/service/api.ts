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