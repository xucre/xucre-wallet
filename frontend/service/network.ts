import { defaultPath, entropyToMnemonic, HDNode, Mnemonic } from "@ethersproject/hdnode";
import { BigNumber, providers, utils, Wallet, wordlists } from 'ethers';
const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';

const PROVIDER = providers.getDefaultProvider(network);



export const constructDefaultNetworks = () => {
  return [
    {
      blockExplorer: 'https://etherscan.io',
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      symbol: 'ETH',
    },
    {
      blockExplorer: 'https://polygonscan.com',
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com',
      symbol: 'MATIC',
    },
    {
      blockExplorer: 'https://mumbai.polygonscan.com/',
      chainId: 80001,
      name: 'Polygon Testnet',
      rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
      symbol: 'MATIC',
    }
  ];
}