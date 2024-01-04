import { BigNumber, ethers, getDefaultProvider, Wallet, utils } from 'ethers';
import { Network } from './network';
import { Interface } from 'ethers/lib/utils';
import erc20 from '../assets/contracts/erc20.abi.json'
import erc721 from '../assets/contracts/erc721.abi.json'
import erc1155 from '../assets/contracts/erc1155.abi.json'
import { logTopicMap } from './constants';

export type Transaction = {
  readonly hash: string;
  readonly blocknumber?: number;
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
  hash: string;
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

export type CovalentTransactionV3 = {
  block_signed_at: string,
  block_height: number,
  block_hash: string,
  tx_hash: string,
  successful: Boolean,
  from_address: string,
  to_address: string,
  value: string,
  pretty_value_quote: string,
  gas_metadata: {
    contract_decimals: number,
    contract_name: string,
    contract_ticker_symbol: string,
    contract_address: string,
    logo_url: string
  },
  gas_spent: string,
  pretty_gas_quote: string,
  explorers: {
    label: string,
    url: string
  },
  dex_details: {
    log_offset: number,
    protocol_name: string,
    protocol_address: string,
    protocol_logo_url: string,
    aggregator_name: string,
    aggregator_address: string,
    event: string,
    pair_address: string,
    pair_lp_fee_bps: number,
    lp_token_address: string,
    lp_token_ticker: string,
    lp_token_num_decimals: number,
    lp_token_name: string,
    lp_token_value: number,
    exchange_rate_usd: number,
    token_0_address: string,
    token_0_ticker: string,
    token_0_num_decimals: number,
    token_0_name: string,
    token_1_address: string,
    token_1_ticker: string,
    token_1_num_decimals: number,
    token_1_name: string,
    token_0_amount: number,
    token_0_quote_rate: number,
    token_0_usd_quote: number,
    pretty_token_0_usd_quote: string,
    token_0_logo_url: string,
    token_1_amount: number,
    token_1_quote_rate: number,
    token_1_usd_quote: number,
    pretty_token_1_usd_quote: string,
    token_1_logo_url: string,
    sender: string,
    recipient: string,
  },
  nft_sale_details: {
    log_offset: number,
    topic0: string,
    protocol_contract_address: string,
    protocol_name: string,
    protocol_logo_url: string,
    to: string,
    from: string,
    maker: string,
    taker: string,
    token_id: number,
    collection_address: string,
    collection_name: string,
    token_address: string,
    token_name: string,
    ticker_symbol: string,
    num_decimals: number,
    contract_quote_rate: number,
    nft_token_price: number,
    nft_token_price_usd: number,
    pretty_nft_token_price_usd: string,
    nft_token_price_native: number,
    pretty_nft_token_price_native: string,
    token_count: number,
    num_token_ids_sold_per_sale: number,
    num_token_ids_sold_per_tx: number,
    num_collections_sold_per_sale: number,
    num_collections_sold_per_tx: number,
    trade_type: string,
    trade_group_type: string,

  },
  log_events: {
    block_signed_at: string,
    block_height: number,
    tx_offset: number,
    log_offset: number,
    tx_hash: string,
    raw_log_topics: any,
    sender_contract_decimals: number,
    sender_name: string,
    sender_contract_ticker_symbol: string,
    sender_address: string,
    sender_address_label: string,
    sender_logo_url: string,
    raw_log_data: string,
  }
}

// Define the interface for the parsed transaction
export type ParsedTransaction = {
  transactionId: string;
  contractType: string;
  action: string;
  amount: string;
  valueRaw: BigNumber;
  contractAddress: string;
  spam: boolean;
}

export type LogMap = {
  topic: string;
  argsToAction: string[];
  singularAction?: string;
  argsToType: LogMapType[];
}

export type LogMapType = {
  label: string;
  dataType: string;
  isValue: boolean;
}

const ERC721_INTERFACE_ID = "0x80ac58cd";
const ERC20_INTERFACE_ID = "0x36372b07";
const ERC1155_INTERFACE_ID = "0xd9b67a26";
const erc20Interface = new Interface(erc20);
const erc721Interface = new Interface(erc721);
const erc1155Interface = new Interface(erc1155);
const UNKNOWN_TRANSACTION = {
  transactionId: '',
  contractType: 'Unknown', 
  eventType: 'Unknown',
  action: 'Unknown',
  amount: '',
  valueRaw: BigNumber.from(0),
  contractAddress: '',
  spam: false
} as ParsedTransaction;

// Function to parse a list of transactions
export async function parseTransaction(wallet: Wallet, transaction: CovalentTransactionV3, _network: Network): Promise<ParsedTransaction> {
  const provider = getDefaultProvider(_network.rpcUrl);

  const receipt = await provider.getTransactionReceipt(transaction.tx_hash);
  const toAddress = receipt.to;
  const addressType = await checkAddressType(toAddress, provider);

  if (addressType === 'Wallet') {
    return {
      transactionId: transaction.tx_hash,
      contractType: 'Wallet', 
      eventType: 'Transfer',
      contractAddress: transaction.to_address,
      action: utils.getAddress(toAddress) === utils.getAddress(wallet.address) ? 'Recieve' : 'Send',
      amount: utils.formatEther(BigNumber.from(transaction.value)),
      valueRaw: BigNumber.from(transaction.value),
      spam: false
    } as ParsedTransaction;
  }

  const matchedLog : ethers.providers.Log | undefined = receipt.logs.find((log) => {
    try {
        const _parsedLog = parseLog(wallet, transaction, log, addressType) || null;
        if (_parsedLog) {
          return true;
        }
    } catch (error) {
        console.error(`Error parsing log: ${error}`);
    }
  }, {} as ParsedTransaction)
  if (!matchedLog) {
    //console.log('no matching log');
    return {
      ...UNKNOWN_TRANSACTION, 
      transactionId: transaction.tx_hash,
      contractAddress: transaction.to_address,
      amount: utils.formatEther(BigNumber.from(transaction.value)), 
      valueRaw: BigNumber.from(transaction.value)
    };
  }
  const parsedLog : ParsedTransaction | null = parseLog(wallet, transaction, matchedLog, addressType);
  if (!parsedLog) {
    //console.log('no parsed log');
    return {
      ...UNKNOWN_TRANSACTION, 
      transactionId: transaction.tx_hash,
      contractAddress: transaction.to_address,
      amount: utils.formatEther(BigNumber.from(transaction.value)), 
      valueRaw: BigNumber.from(transaction.value)
    };
  }
  return parsedLog;
}

// Function to parse a single log entry
function parseLog(wallet: Wallet, transaction: CovalentTransactionV3, log: ethers.providers.Log, addressType: string): ParsedTransaction | null {
  try {
    const topicList = logTopicMap[addressType as keyof typeof logTopicMap];
    const logValues = addressType === 'ERC20' ? erc20Interface.parseLog(log) 
      : addressType === 'ERC721' ? erc721Interface.parseLog(log) 
      : addressType === 'ERC1155' ? erc1155Interface.parseLog(log) 
      : null;
    if (logValues === null) {
      console.log('logValues are empty')
      return null;
    }

    const matchedTopic = topicList.find((topicData) => {
      if (log.topics.includes(topicData.topic)) return topicData;
    });
    if (!matchedTopic) {
      console.log('matched topics are empty');
      return null;
    }
    const action = matchedTopic.singularAction !== null ? 
      matchedTopic.singularAction : 
      logValues.args.reduce((returnVal, argVal, index) => {
        if (utils.isAddress(argVal) && returnVal.length === 0) {
          if (utils.getAddress(argVal) === utils.getAddress(wallet.address)) return matchedTopic.argsToAction[index];
        }
        return returnVal;
      },null);
    
    if (!action) {
      //console.log('no matching action');
      return null;
    }

    return {
      transactionId: transaction.tx_hash,
      contractType: addressType, 
      contractAddress: transaction.to_address,
      action,
      amount: utils.formatEther(BigNumber.from(transaction.value)),
      valueRaw: BigNumber.from(transaction.value),
      spam: false
    } as ParsedTransaction;
  } catch (err) {
    console.log('error parsing log');
    return null;
  }
  
}

async function checkAddressType(contractAddress: string, provider: ethers.providers.BaseProvider): Promise<string> {
    const contract = new ethers.Contract(contractAddress, ["function supportsInterface(bytes4 interfaceID) external view returns (bool)"], provider);
    
    const isContractTransaction = await isContractAddress(contractAddress, provider);
    if (!isContractTransaction) {
      return "Wallet";
    }

    const isERC721 = await contract.supportsInterface(ERC721_INTERFACE_ID);
    if (isERC721) {
        return "ERC721";
    }

    const isERC20 = await contract.supportsInterface(ERC20_INTERFACE_ID);
    if (isERC20) {
        return "ERC20";
    }

    const isERC1155 = await contract.supportsInterface(ERC1155_INTERFACE_ID);
    if (isERC1155) {
        return "ERC1155";
    }
    
    return "Unknown";
}

async function isContractAddress(address: string, provider: ethers.providers.BaseProvider): Promise<boolean> {
  const code = await provider.getCode(address);
  return code !== '0x'; // If code is not '0x', it's a contract
}

// Example usage
// const transactionIds = ["0x..."]; // Add transaction IDs here
// const providerUrl = "YOUR_PROVIDER_URL"; // Replace with your Ethereum provider URL
// parseTransactions(transactionIds, providerUrl)
//   .then(parsedTransactions => console.log(parsedTransactions))
//   .catch(error => console.error(error));