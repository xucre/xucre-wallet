
const network = (process.env.NODE_ENV === 'production') ? 'mainnet' : 'rinkeby';


export type Network = {
  blockExplorer?: string;
  chainId: number;
  name: string;
  rpcUrl: string;
  symbol: string;
}

export const constructDefaultNetworks = () => {
  return [
    {
      blockExplorer: 'https://polygonscan.com/',
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'wss://polygon-mainnet.g.alchemy.com/v2/bsM5z8TEIScYSa3DOSka2nmm8VDmFa21',
      symbol: 'MATIC',
    } as Network,
    {
      blockExplorer: 'https://etherscan.io/',
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'wss://eth-mainnet.g.alchemy.com/v2/JqOD3cdBDl50H65bk315fAE614CDHa9u',
      symbol: 'ETH',
    } as Network,
    {
      blockExplorer: 'https://mumbai.polygonscan.com/',
      chainId: 80001,
      name: 'Polygon Testnet',
      rpcUrl: 'wss://polygon-mumbai.g.alchemy.com/v2/Lhg7TLiuGtQ3-HMJWB3NO_ok2Nlu01um',
      symbol: 'MATIC',
    } as Network,
    {
      blockExplorer: 'https://celoscan.io/',
      chainId: 42220,
      name: 'Celo',
      rpcUrl: 'https://celo-mainnet.infura.io/v3/e595b78c8e394eb99874eeb62d7e5080',
      symbol: 'CELO',
    } as Network,
  ];
}