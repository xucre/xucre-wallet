import { BigNumber } from "ethers";
import { chainIdToNameMap } from "./constants";
import { getTokenItems, getTokenPriceMap } from "../store/tokenItem";
import { loadActiveWallet } from "./wallet";

export type Token = {
  readonly address: string;
  readonly amount?: BigNumber;
  readonly chainId: number;
  readonly name: string;
  readonly type: string;
  readonly logo?: string;
  readonly symbol?: string;
  readonly isNotSpammable?: boolean;
  readonly quote_rate?: number;
  readonly decimals?: number;
}

export type SerializedToken = {
  readonly address: string;
  readonly amount?: string;
  readonly chainId: number;
  readonly name: string;
  readonly type: string;
  readonly logo?: string;
  readonly quote_rate?: number;
  readonly decimals?: number;
  readonly symbol?: string;
  readonly isNotSpammable?: boolean;
}

export type TokenPrice = {
  readonly chainId: string;
  readonly address: string;
  readonly price: number;
  readonly prettyPrice: string;
}

export type TokenMap = { [key: string]: TokenPrice }

export async function getAllTokens() {
  let prevState = {} as {[key:number] : Token[]};
  const wallet = await loadActiveWallet();
  if (wallet) {
    await Object.keys(chainIdToNameMap).forEach(async (chainId) => {
      const _existingTokens = await getTokenItems(wallet.address,  Number(chainId))
      if (_existingTokens && _existingTokens?.length > 0) {
        prevState = {...prevState,  [Number(chainId)] : _existingTokens};
      }
    })  
  } 
  return prevState;
}

export async function getAllTokenPrices() {
  let prevState = {} as {[key:number] : {[key: string]: TokenPrice}};
  const wallet = await loadActiveWallet();
  if (wallet) {
    await Object.keys(chainIdToNameMap).forEach(async (chainId) => {
      const _existingValue = await getTokenPriceMap(wallet.address,  Number(chainId))
      if (_existingValue && Object.keys(_existingValue)?.length > 0) {
        prevState = {...prevState,  [Number(chainId)] : _existingValue};
      }
    })
  } 
  return prevState;
}