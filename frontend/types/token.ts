export type AlchemyMetadata = {
  readonly logo?: string;
  readonly symbol?: string;
  readonly name?: string;
  readonly decimals?: number;
}

export type CovalentTokenHistoryItem = {
  block_signed_at: string,
  block_height: number,
  block_hash: string,
  tx_hash: string,
  successful: boolean,
  from_address: string,
  to_address: string,
  value: string,
  pretty_value_quote: string,
  gas_metadata: {
    contract_decimals: number,
    contract_name: string,
    contract_ticker_symbol: string,
    contract_address: string,
    logo_url: string,
  },
  gas_spent: string,
  pretty_gas_quote: string,
  transfers: [
    {
      block_signed_at: string,
      tx_hash: string,
      from_address: string,
      from_address_label: string,
      to_address: string,
      to_address_label: string,
      contract_decimals: number,
      contract_name: string,
      contract_ticker_symbol: string,
      contract_address: string,
      logo_url: string,
      transfer_type: string,
      delta: string,
      balance: string,
      quote_rate: number,
      delta_quote: number,
      pretty_delta_quote: string,
      balance_quote: string,
      explorers: [
        {
          label: string,
          url: string,
        },
      ],
      method_calls: string,
    },
  ],
}

export type CovalentTransferHistory = {
  items: CovalentTokenHistoryItem[],
  chainId: Number,
  chainName: string,
  walletAddress: string,
  lastModified: Number,
  tokenAddress: string,
}