import { defaultPath, entropyToMnemonic, HDNode, Mnemonic } from "@ethersproject/hdnode";
import { BigNumber, providers, utils, Wallet, wordlists } from 'ethers';
const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';

const PROVIDER = providers.getDefaultProvider(network);

export type Network = {
  readonly blockExplorer?: string;
  readonly chainId: number;
  readonly name: string;
  readonly rpcUrl: string;
  readonly symbol: string;
}

export const constructDefaultNetworks = () => {
  return [
    {
      blockExplorer: 'https://etherscan.io/',
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'wss://nd-lu5iumrlejgoxnmlpsxb2nkyw4.wss.ethereum.managedblockchain.us-east-1.amazonaws.com',
      symbol: 'ETH',
    } as Network,
    {
      blockExplorer: 'https://polygonscan.com/',
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'wss://rpc-mumbai.maticvigil.com/ws/v1/0c4a9f14b452f00dc7bcf6b571b1de22a6126b86',
      symbol: 'MATIC',
    } as Network,
    {
      blockExplorer: 'https://mumbai.polygonscan.com/',
      chainId: 80001,
      name: 'Polygon Testnet',
      rpcUrl: 'wss://rpc-mumbai.maticvigil.com/ws/v1/0c4a9f14b452f00dc7bcf6b571b1de22a6126b86',
      symbol: 'MATIC',
    } as Network
  ];
}