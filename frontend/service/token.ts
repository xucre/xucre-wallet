import { BigNumber } from "ethers";

export type Token = {
  readonly address: string;
  readonly amount?: BigNumber;
  readonly chainId: number;
  readonly name: string;
  readonly type: string;
  readonly logo?: string;
  readonly symbol?: string;
  readonly isNotSpammable?: boolean;
}

export type SerializedToken = {
  readonly address: string;
  readonly amount?: string;
  readonly chainId: number;
  readonly name: string;
  readonly type: string;
  readonly logo?: string;
  readonly decimals?: number;
  readonly symbol?: string;
  readonly isNotSpammable?: boolean;
}

export type TokenPrice = {
  readonly address: string;
  readonly price: number;
  readonly prettyPrice: string;
}