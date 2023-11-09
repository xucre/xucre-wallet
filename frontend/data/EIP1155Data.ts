
/**
 * Types
 */
 export type TEIP155Chain = keyof typeof EIP155_CHAINS;
 
/**
 * Chains
 */
 export const EIP155_MAINNET_CHAINS = {
  'eip155:1': {
    chainId: 1,
    logo: '/chain-logos/eip155-1.png',
    name: 'Ethereum',
    rgb: '99, 125, 234',
    rpc: 'https://cloudflare-eth.com/'
  },
  'eip155:10': {
    chainId: 10,
    logo: '/chain-logos/eip155-10.png',
    name: 'Optimism',
    rgb: '235, 0, 25',
    rpc: 'https://mainnet.optimism.io'
  },
  'eip155:137': {
    chainId: 137,
    logo: '/chain-logos/eip155-137.png',
    name: 'Polygon',
    rgb: '130, 71, 229',
    rpc: 'https://polygon-rpc.com/'
  },
  'eip155:43114': {
    chainId: 43114,
    logo: '/chain-logos/eip155-43113.png',
    name: 'Avalanche C-Chain',
    rgb: '232, 65, 66',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  }
}

export const EIP155_TEST_CHAINS = {
  'eip155:420': {
    chainId: 420,
    logo: '/chain-logos/eip155-10.png',
    name: 'Optimism Goerli',
    rgb: '235, 0, 25',
    rpc: 'https://goerli.optimism.io'
  },
  'eip155:43113': {
    chainId: 43113,
    logo: '/chain-logos/eip155-43113.png',
    name: 'Avalanche Fuji',
    rgb: '232, 65, 66',
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc'
  },
  'eip155:5': {
    chainId: 5,
    logo: '/chain-logos/eip155-1.png',
    name: 'Ethereum Goerli',
    rgb: '99, 125, 234',
    rpc: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
  },
  'eip155:80001': {
    chainId: 80001,
    logo: '/chain-logos/eip155-137.png',
    name: 'Polygon Mumbai',
    rgb: '130, 71, 229',
    rpc: 'https://matic-mumbai.chainstacklabs.com'
  }
}

export const EIP155_CHAINS = { ...EIP155_MAINNET_CHAINS, ...EIP155_TEST_CHAINS }

/**
 * Methods
 */
export const EIP155_SIGNING_METHODS = {
  ETH_SEND_RAW_TRANSACTION: 'eth_sendRawTransaction',
  ETH_SEND_TRANSACTION: 'eth_sendTransaction',
  ETH_SIGN: 'eth_sign',
  ETH_SIGN_TRANSACTION: 'eth_signTransaction',
  ETH_SIGN_TYPED_DATA: 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V3: 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V4: 'eth_signTypedData_v4',
  PERSONAL_SIGN: 'personal_sign',
}