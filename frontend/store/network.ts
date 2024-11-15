
import EncryptedStorage from 'react-native-encrypted-storage';

import { Network, constructDefaultNetworks } from "../service/network";

export const storeNetwork = async (network: Network) => {
  const _networks = await EncryptedStorage.getItem("network_list");
  if (_networks) {
    const networks = JSON.parse(_networks as string);
    if (Array.isArray(networks)) {
      await EncryptedStorage.setItem(
        "network_list",
        JSON.stringify([...networks, network])
      );
    } else {
      await EncryptedStorage.setItem(
        "network_list",
        JSON.stringify([...constructDefaultNetworks()])
      );
    }
  } else {
    await EncryptedStorage.setItem(
      "network_list",
      JSON.stringify([...constructDefaultNetworks()])
    );
  }
  
};

export const updateNetwork = async (network: { blockExplorer?: string | undefined; chainId: any; name?: string; rpcUrl?: string; symbol?: string; }) => {
  const _networks = await EncryptedStorage.getItem("network_list");
  if (_networks) {
    const networks = JSON.parse(_networks as string);
    if (Array.isArray(networks)) {
      const newNetworkList = networks.map((_network) => {
        if (_network.chainId === network.chainId) {
          return network;
        } else {
          return _network;
        }
      });
      await EncryptedStorage.setItem(
        "network_list",
        JSON.stringify(newNetworkList)
      );
    } else {
      await EncryptedStorage.setItem(
        "network_list",
        JSON.stringify([...constructDefaultNetworks()])
      );
    }
  } else {
    await EncryptedStorage.setItem(
      "network_list",
      JSON.stringify([...constructDefaultNetworks()])
    );
  }
  
};

export const deleteNetwork = async (network: { chainId: any; }) => { 
  const _networks = await EncryptedStorage.getItem("network_list"); 
  const networks = JSON.parse(_networks as string); 
  if (Array.isArray(networks)) { 
    const newNetworkList = networks.filter((_network) => { 
      return _network.chainId !== network.chainId    
    }); 
    await EncryptedStorage.setItem( 
      "network_list", 
      JSON.stringify(newNetworkList) 
    ); 
  } else { 
    await EncryptedStorage.setItem( 
      "network_list", 
      JSON.stringify([...constructDefaultNetworks()]) 
    ); 
  } 
}; 

export const storeNetworks = async (networks: Network[]) => {
  await EncryptedStorage.setItem(
    "network_list",
    JSON.stringify(networks)
  );
};

export const storeActiveNetwork = async (network: Network) => {
  await EncryptedStorage.setItem(
    "active_network",
    JSON.stringify(network)
  );
};

export const getActiveNetwork = async () => {
  const network = await EncryptedStorage.getItem('active_network');
  if (!network) {
    return {
      blockExplorer: 'https://etherscan.io',
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'wss://eth-mainnet.g.alchemy.com/v2/JqOD3cdBDl50H65bk315fAE614CDHa9u',
      symbol: 'ETH',
    } as Network;
  }
  return JSON.parse(network as string) as Network;
}

export const getNetworks = async () => {
  //return constructDefaultNetworks();
  const _networks = await EncryptedStorage.getItem('network_list');
  if (!_networks) {
    return constructDefaultNetworks();
  }
  const networks = JSON.parse(_networks as string);
  if (networks && networks.length > 0) {
    return networks;
  }
  return constructDefaultNetworks();
}

export const coinIconNames = {
  1: 'eth',
  137: 'matic',
  80001: 'matic',
  42220: 'celo',
  20090103: 'btc'
}

export const tokenIconNames = {
  '137-0x924442a46eac25646b520da8d78218ae8ff437c2' : 'xucre'
}