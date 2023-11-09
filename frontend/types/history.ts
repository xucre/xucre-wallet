
export type OpenQuotes = {
  direction: string;
  quotes: QuoteValue[]
}

export type QuoteValue = { date: string; totalQuote: number; }
export type HoldingBalance = {balance: number; quote: number;}
export interface ExtendedBalance extends HoldingBalance {
  timestamp?: number
}
export type Holding = {
  timestamp: string;
  quote_rate: number;
  open: HoldingBalance;
  high: HoldingBalance;
  low: HoldingBalance;
  close: HoldingBalance;
};

export type Item = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: boolean;
  logo_url: string;
  holdings: Holding[];
};

export type JsonDataModel = {
  error: string;
  error_message: string;
  error_code: string;
  walletAddress: string;
  updatedAt: string;
  chainId: number;
  chainName: string;
  lastModified: number;
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currency: string;
    chain_id: number;
    chain_name: string;
    items: Item[];
  };
};

export type OutputObject = {
  isTokenValue: boolean,
  openQuotesByDay: {
    quoteRate: any;
    date: string;
    totalQuote: number;
  }[];
  itemsWithRecentOpenQuote: ItemsWithOpenQuote[];
};

export type ItemsWithOpenQuote = {
  contract: {
    name: string;
    ticker_symbol: string;
    address: string;
  };
  mostRecentOpenQuote: HoldingBalance;
}

export type ChartData = {
  meta: {
    'date': string
  },
  x: number,
  y: number
}