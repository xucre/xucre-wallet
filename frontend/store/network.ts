import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

import { Network, constructDefaultNetworks } from "../service/network";

export const storeNetwork = async (network: Network) => {
  const _networks = await EncryptedStorage.getItem("network_list");
  const networks = JSON.parse(_networks as string);
  if (Array.isArray(networks)) {
    await EncryptedStorage.setItem(
      "network_list",
      JSON.stringify([...networks, network])
    );
  } else {
    await EncryptedStorage.setItem(
      "network_list",
      JSON.stringify([network])
    );
  }
};

export const updateNetwork = async (network: { blockExplorer?: string | undefined; chainId: any; name?: string; rpcUrl?: string; symbol?: string; }) => {
  const _networks = await EncryptedStorage.getItem("network_list");
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
      JSON.stringify([network])
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
      JSON.stringify([]) 
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
    return undefined;
  }
  return JSON.parse(network as string);
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

export const iconNames = {
  1: 'ETH',
  137: 'PLY',
  80001: 'PLY'
}