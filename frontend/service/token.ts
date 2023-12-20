import { BigNumber } from "ethers";

export type Token = {
  readonly address: string;
  readonly amount?: BigNumber;
  readonly chainId: number;
  readonly name: string;
  readonly type: string;
  readonly logo?: string;
  readonly symbol?: string;
}
