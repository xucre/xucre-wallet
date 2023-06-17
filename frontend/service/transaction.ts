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

export type CovalentTransaction = {
  readonly block_height: number,
  readonly block_signed_at: number,
  readonly fees_paid: string,
  readonly from_address_label: string,
  readonly from_address: string,
  readonly gas_offered: string,
  readonly gas_price: string,
  readonly gas_quote_rate: number,
  readonly gas_quote: number,
  readonly gas_spent: string,
  readonly pretty_gas_quote: string,
  readonly pretty_value_quote: string,
  readonly successful: boolean,
  readonly to_address_label: string,
  readonly to_address: string,
  readonly tx_hash: string,
  readonly tx_offset: number,
  readonly value_quote: number,
  readonly value: string,
}