/* eslint-disable no-case-declarations */
import { formatJsonRpcError, formatJsonRpcResult, JsonRpcResponse, JsonRpcResult } from '@json-rpc-tools/utils'
import SignClient from '@walletconnect/sign-client';
import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'
import { getDefaultProvider, providers, utils } from 'ethers'
import { useRecoilState } from "recoil";

import { EIP155_CHAINS, EIP155_SIGNING_METHODS, EIP155_TEST_CHAINS, TEIP155Chain } from '../data/EIP1155Data';
import { getNetworks } from "../store/network";

import { AppWallet, language as stateLanguage, walletList } from "./state"

export function rejectEIP155Request(request) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}

export async function approveEIP155Request(
  requestEvent,
  wallets
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const walletAddresses = wallets.map((_wallet: AppWallet) => {
    return _wallet.address;
  })
  const matchedAddress = getWalletAddressFromParams(walletAddresses, params);
  const wallet = wallets.find((_wallet => {    
    return matchedAddress === _wallet.address;
  }))
  const _networks = await getNetworks();
  const network = _networks.find((_network) => {
    //console.log(_network.chainId == chainId.split(':')[1]);
    return _network.chainId == chainId.split(':')[1];
  })

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params)
      const signedMessage = await wallet.wallet.signMessage(message)
      return formatJsonRpcResult(id, signedMessage)

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      const { domain, types, message: data } = getSignTypedDataParamsData(request.params)
      // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
      // eslint-disable-next-line functional/immutable-data
      delete types.EIP712Domain
      const signedData = await wallet.wallet._signTypedData(domain, types, data)
      return formatJsonRpcResult(id, signedData)

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      const provider = network ? getDefaultProvider(network.rpcUrl) : new providers.JsonRpcProvider(EIP155_CHAINS[chainId as TEIP155Chain].rpc);
      //console.log(provider);
      const sendTransaction = request.params[0];
      console.log('connecting wallet');
      const connectedWallet = wallet.wallet.connect(provider);
      console.log('sending transaction');
      const { hash } = await connectedWallet.sendTransaction(sendTransaction);
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0]
      const signature = await wallet.wallet.signTransaction(signTransaction)
      return formatJsonRpcResult(id, signature)

    default:
      return formatJsonRpcError(id, getSdkError('INVALID_METHOD').message)
  }
}

/**
 * Gets message from various signing request methods by filtering out
 * a value that is not an address (thus is a message).
 * If it is a hex string, it gets converted to utf8 string
 */
 export function getSignParamsMessage(params) {
  const message = params.filter(p => !utils.isAddress(p))[0]

  return convertHexToUtf8(message)
}

/**
 * Gets data from various signTypedData request methods by filtering out
 * a value that is not an address (thus is data).
 * If data is a string convert it to object
 */
export function getSignTypedDataParamsData(params) {
  const data = params.filter(p => !utils.isAddress(p))[0];

  if (typeof data === 'string') {
    return JSON.parse(data);
  }

  return data
}

/**
 * Get our address from params checking if params string contains one
 * of our wallet addresses
 */
export function getWalletAddressFromParams(addresses: readonly string[], params) {
  const paramsString = JSON.stringify(params);

  const address = addresses.reduce((prev, addr) => {
    if (paramsString.toLowerCase().includes(addr.toLowerCase())) {
      return addr;
    } 
    return prev;   
  }, '')

  return address;
}

/**
 * Converts hex to utf8 string if it is valid bytes
 */
 export function convertHexToUtf8(value: string) {
  if (utils.isHexString(value)) {
    return utils.toUtf8String(value)
  }

  return value
}