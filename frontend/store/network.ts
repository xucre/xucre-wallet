import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';

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
  const networks = await EncryptedStorage.getItem('network_list');
  return JSON.parse(networks);
}
