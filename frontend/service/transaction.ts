import { BigNumber } from "ethers";

export type Transaction = {
  readonly hash: string;
  readonly blockNumber?: number;
  readonly chainId: number;
  readonly status: string;
  readonly from?: string;
  readonly nonce?: number;
  readonly to?: string;
  readonly data?: string;
  readonly value?: BigNumber;
  readonly submitDate?: Date;
}