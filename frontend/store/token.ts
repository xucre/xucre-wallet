import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

import { Token } from "../service/token";

export const addToken = async (token: Token) => {
  const _tokens = await EncryptedStorage.getItem("token_list");
  const tokens = JSON.parse(_tokens) as readonly Token[];
  if (Array.isArray(tokens)) {
    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([...tokens, token])
    );
  } else {
    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([token])
    );
  }
};

export const updateToken = async (token: Token) => {
  const _tokens = await EncryptedStorage.getItem("token_list");
  const tokens = JSON.parse(_tokens) as readonly Token[];
  if (Array.isArray(tokens)) {
    tokens.map((_token) => {
      if (_token.address === token.address && _token.chainId === token.chainId) {
        return token;
      } else {
        return _token;
      }
    });


    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([...tokens, token])
    );
  } else {
    await EncryptedStorage.setItem(
      "token_list",
      JSON.stringify([token])
    );
  }
};

export const storeTokens = async (tokens: Token) => {
  await EncryptedStorage.setItem(
    "token_list",
    JSON.stringify(tokens)
  );
};

export const storeActiveToken = async (token: Token) => {
  await EncryptedStorage.setItem(
    "active_token",
    JSON.stringify(token)
  );
};

export const getActivetoken = async () => {
  const token = await EncryptedStorage.getItem('active_token');
  return JSON.parse(token) as Token;
}

export const getTokens = async () => {
  const tokens = await EncryptedStorage.getItem('token_list');
  return JSON.parse(tokens) as readonly Token[];
}

export const getTokenByChain = async (chainId) => {
  const tokens = await EncryptedStorage.getItem('token_list');
  const _tokens = JSON.parse(tokens) as readonly Token[];
  return _tokens.filter((token: Token) => {
    return token.chainId === chainId;
  })
}
