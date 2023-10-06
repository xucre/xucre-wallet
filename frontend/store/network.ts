import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

import { constructDefaultNetworks } from "../service/network";

export const storeNetwork = async (network) => {
  const _networks = await EncryptedStorage.getItem("network_list");
  const networks = JSON.parse(_networks);
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

export const updateNetwork = async (network) => {
  const _networks = await EncryptedStorage.getItem("network_list");
  const networks = JSON.parse(_networks);
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

export const deleteNetwork = async (network) => { 
  const _networks = await EncryptedStorage.getItem("network_list"); 
  const networks = JSON.parse(_networks); 
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

export const storeNetworks = async (networks) => {
  await EncryptedStorage.setItem(
    "network_list",
    JSON.stringify(networks)
  );
};

export const storeActiveNetwork = async (network) => {
  await EncryptedStorage.setItem(
    "active_network",
    JSON.stringify(network)
  );
};

export const getActiveNetwork = async () => {
  const network = await EncryptedStorage.getItem('active_network');
  return JSON.parse(network);
}

export const getNetworks = async () => {
  //return constructDefaultNetworks();
  const networks = await EncryptedStorage.getItem('network_list');
  return JSON.parse(networks);
}

export const iconNames = {
  1: 'ETH',
  137: 'PLY',
  80001: 'PLY'
}