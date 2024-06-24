
import EncryptedStorage from 'react-native-encrypted-storage';

import { Token } from "../service/token";
import { CovalentTokenHistoryItem, CovalentTransferHistory } from '../types/token';

export const addToken = async (token: Token) => {
  const _tokens = await EncryptedStorage.getItem("token_list");
  if (!_tokens) {
    return undefined;
  }
  const tokens = JSON.parse(_tokens as string) as readonly Token[];
  
  if (Array.isArray(tokens)) {
      const isSet = await EncryptedStorage.setItem(
        "token_list",
        JSON.stringify([...tokens, token])
      );
    
  } else {
    const isSet = await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([token])
    );
  }
};

export const updateToken = async (token: Token) => {
  const _tokens = await EncryptedStorage.getItem("token_list");
  if (!_tokens) {
    return undefined;
  }
  const tokens = JSON.parse(_tokens as string) as readonly Token[];
  if (Array.isArray(tokens)) {
    const newTokens = tokens.map((_token) => {
      if (_token.address === token.address && _token.chainId === token.chainId) {
        return token;
      } else {
        return _token;
      }
    });

    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([...newTokens])
    );
  } else {
    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([token])
    );
  }
};


export const deleteToken = async (token: Token) => {
  const _tokens = await EncryptedStorage.getItem("token_list");
  if (!_tokens) {
    return undefined;
  }
  const tokens = JSON.parse(_tokens as string);
  if (Array.isArray(tokens)) {
    const netTokenList = tokens.filter((_token) => {
      return !(_token.chainId === token.chainId && _token.address === token.address) 
    });
    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify(netTokenList)
    );
  } else {
    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([])
    );
  }
};


export const storeTokens = async (tokens: Token) => {
  try {
    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify(tokens)
    );
  } catch (err) {
  }
  
};

export const storeActiveToken = async (token: Token) => {
  await EncryptedStorage.setItem(
    "active_token",
    JSON.stringify(token)
  );
};

export const getActivetoken = async () => {
  const token = await EncryptedStorage.getItem('active_token');
  if (!token) {
    return undefined;
  }
  return JSON.parse(token as string) as Token;
}

export const getTokens = async () => {
  const tokens = await EncryptedStorage.getItem('token_list');
  if (!tokens) {
    return undefined;
  }
  return JSON.parse(tokens as string) as readonly Token[];
}

export const getTokenByChain = async (chainId: number) => {
  const tokens = await EncryptedStorage.getItem('token_list');
  if (!tokens) {
    return undefined;
  }
  const _tokens = JSON.parse(tokens as string) as readonly Token[];
  if (_tokens && Array.isArray(_tokens)) {
    return _tokens.filter((token: Token) => {
      return token.chainId === chainId;
    })
  } else {
    const placeholder = [] as readonly Token[];
    return placeholder;
  }
  
  
}


export const storeTokenHistoryItems = async (walletAddress: string, tokenAddress: string, chainId: number, list: CovalentTokenHistoryItem[]) => {
  await EncryptedStorage.setItem(
    `tokenHistory:${walletAddress}:${chainId}:${tokenAddress}`,
    JSON.stringify(list)
  );
};

export const getTokenHistoryItems = async (walletAddress: string, tokenAddress: string, chainId: number) => {
  const list = await EncryptedStorage.getItem(`tokenHistory:${walletAddress}:${chainId}:${tokenAddress}`);
  if (!list) {
    return null;
  }
  return JSON.parse(list as string) as CovalentTokenHistoryItem[];
};
