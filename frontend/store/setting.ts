import { BigNumber } from "ethers";
import EncryptedStorage from 'react-native-encrypted-storage';
import * as Keychain from 'react-native-keychain';

export const storeTheme = async (mode) => {
  await EncryptedStorage.setItem(
    "theme_mode",
    mode
  );
};

export const getTheme = async () => {
  const theme = await EncryptedStorage.getItem('theme_mode')
  return theme;
}
 
export const storeWCLegacyUrl = async (url) => {
  await EncryptedStorage.setItem(
    "wc_legacy_url",
    url
  );
};

export const getWCLegacyUrl = async () => {
  const url = await EncryptedStorage.getItem('wc_legacy_url')
  return url;
}

export const hasPassword = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    return true;
  }
  return false;
}

export const getLastUnlock = async () => {
  const unlockDateRaw = await EncryptedStorage.getItem('lastUnlock');
  if (unlockDateRaw) {
    return unlockDateRaw;
  }
  return null;
}

export const validatePassword = async (_password) => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    if (credentials.password === _password) {
      const unlockDate = Date();
      await EncryptedStorage.setItem('lastUnlock', JSON.stringify(unlockDate));
      return true;
    } 
    return false;
  }
  return true;
}

export const storePassword = async (old, _password) => {
  const credentials = await Keychain.getGenericPassword();
  const unlockDate = Date();
  if (credentials) {
    if (credentials.password === old) {      
      await Keychain.setGenericPassword('app', _password);
      await EncryptedStorage.setItem('lastUnlock', JSON.stringify(unlockDate));
    } else {
      return new Error('invalid password');
    }
  } else {
    await Keychain.setGenericPassword('app', _password);
    await EncryptedStorage.setItem('lastUnlock', JSON.stringify(unlockDate));
  }
  
  return {message: 'success'};
}

export const storePrivacyPolicy = async () => {
  await EncryptedStorage.setItem(
    "privacy_policy",
    'yes'
  );
};

export const hasSignedPrivacyPolicy = async () => {
  const value = await EncryptedStorage.getItem('privacy_policy')
  return value === 'yes';
}

export const addNotification = async (id, event) => {
  const _events = await EncryptedStorage.getItem("connect_events");
  const events = JSON.parse(_events);
  if (events) {
    if (events[id]) {
      return;
    }

    await EncryptedStorage.setItem(
      "connect_events",
      JSON.stringify({...events, [id]: event})
    );
  } else {
    await EncryptedStorage.setItem(
      "connect_events",
      JSON.stringify({[id] :event})
    );
  }
}

export const deleteNotification = async (id) => {
  const _events = await EncryptedStorage.getItem("connect_events");
  const events = JSON.parse(_events);
  if (events) {
    if (events[id]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...newEvents } = events;
      await EncryptedStorage.setItem(
        "connect_events",
        JSON.stringify(newEvents)
      );
    }

    return;
  }
};

export const getNotification = async (id) => {
  const _events = await EncryptedStorage.getItem("connect_events");
  const events = JSON.parse(_events);
  if (events) {
    if (events[id]) {
      return events[id];
    }

    return null;
  }

  return null;
};

export const getAllNotifications = async () => {
  const _events = await EncryptedStorage.getItem("connect_events");
  const events = JSON.parse(_events);
  if (events) {  
    return Object.values(events).sort((a : {readonly id: string},b: {readonly id: string}) => {
      if ( a.id < b.id ){
        return 1;
      }
      if ( a.id > b.id ){
        return -1;
      }
      return 0;
    });
  }

  return null;
};