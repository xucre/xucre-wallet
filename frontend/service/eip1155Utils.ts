/* eslint-disable no-case-declarations */
import { formatJsonRpcError, formatJsonRpcResult } from '@walletconnect/jsonrpc-utils'
import { getSdkError } from '@walletconnect/utils'
import { Wallet, getDefaultProvider, providers, utils } from 'ethers'

import { EIP155_CHAINS, EIP155_SIGNING_METHODS, TEIP155Chain } from '../data/EIP1155Data';
import { getNetworks } from "../store/network";

import { AppWallet } from "./state"
import { WalletInternal } from '../store/wallet';

function transformObject (
  object: any,
  oldKey: string,
  newKey: string,
  chainID: any
) {
  // eslint-disable-next-line functional/no-let, prefer-const
  let newObject = { ...object };

  if (oldKey in newObject) {
    const value = newObject[oldKey];
    // eslint-disable-next-line functional/immutable-data
    delete newObject[oldKey];
    // eslint-disable-next-line functional/immutable-data
    newObject[newKey] = value;
  }

  // eslint-disable-next-line functional/immutable-data
  newObject['chainId'] = chainID;
  return newObject;
}

export function rejectEIP155Request(request: { id?: any; }) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}

export async function approveEIP155Request(
  requestEvent: { params?: any; id?: any; },
  wallets: AppWallet[]
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const walletAddresses = wallets.map((_wallet: AppWallet) => {
    return _wallet.address;
  })
  //
  const matchedAddress = getWalletAddressFromParams(walletAddresses, params);
  const wallet = wallets.find(((_wallet: { address: string; }) => {    
    return matchedAddress === _wallet.address;
  }))
  const _networks = await getNetworks();
  const network = _networks.find((_network: { chainId: any; }) => {
    return _network.chainId == chainId.split(':')[1];
  })
  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params)
      const signedMessage = await (new WalletInternal((wallet as AppWallet).wallet)).signMessage(message)
      return formatJsonRpcResult(id, signedMessage)

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      const { domain, types, message: data } = getSignTypedDataParamsData(request.params)
      // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
      // eslint-disable-next-line functional/immutable-data
      delete types.EIP712Domain
      const signedData = await (new WalletInternal((wallet as AppWallet).wallet))._signTypedData(domain, types, data)
      return formatJsonRpcResult(id, signedData)

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      try {
        const provider = network ? getDefaultProvider(network.rpcUrl) : new providers.JsonRpcProvider(EIP155_CHAINS[chainId as TEIP155Chain].rpc);
      
        const request2 = request.params[0];
        const connectedWallet = await (new WalletInternal((wallet as AppWallet).wallet)).connect(provider);
        const chainID = await (connectedWallet as Wallet).getChainId();
        const req = transformObject(request2, 'gas', 'gasLimit', chainID);
        const { hash } = await (connectedWallet as Wallet).sendTransaction(req);
        
        return formatJsonRpcResult(id, hash);
      } catch (err) {
        const {message} = err as {message: string}
        return formatJsonRpcError(id, message);
      }   

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0]
      const signature = await (new WalletInternal((wallet as AppWallet).wallet)).signTransaction(signTransaction)
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
 export function getSignParamsMessage(params: any[]) {
  const message = params.filter((p: string) => !utils.isAddress(p))[0]

  return convertHexToUtf8(message)
}

/**
 * Gets data from various signTypedData request methods by filtering out
 * a value that is not an address (thus is data).
 * If data is a string convert it to object
 */
export function getSignTypedDataParamsData(params: any[]) {
  const data = params.filter((p: string) => !utils.isAddress(p))[0];

  if (typeof data === 'string') {
    return JSON.parse(data);
  }

  return data
}

/**
 * Get our address from params checking if params string contains one
 * of our wallet addresses
 */
export function getWalletAddressFromParams(addresses: readonly string[], params: any) {
  const paramsString = JSON.stringify(params);

  const address = addresses.reduce((prev, addr) => {
    if (paramsString !== null && addr !== null && paramsString.toLowerCase().includes(addr.toLowerCase())) {
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