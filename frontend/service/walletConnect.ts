import notifee, { AndroidLaunchActivityFlag } from '@notifee/react-native';
import SignClient from '@walletconnect/sign-client';
import { nanoid } from 'nanoid';
import {AppState} from 'react-native';


import translations from "../assets/translations";
import { EIP155_SIGNING_METHODS } from "../data/EIP1155Data";
import { getLanguage } from '../store/language';
import { addNotification, deleteNotification } from '../store/setting';

import { navigate } from './RootNavigation';
import { env } from './constants';
import { SignClientTypes } from '@walletconnect/types';

// eslint-disable-next-line functional/no-let
export let signClient: SignClient;

async function onDisplayNotification(id: string, translation_setting: string) {
  const _language = await getLanguage();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  const notificationPayload = {
    android: {
      channelId,
      largeIcon: require('../assets/images/icon.png'),
      pressAction: {
        id: id,
        launchActivity: 'default',
        launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP], 
      },
      // TODO - Asset Hosting for icon
      //smallIcon: 'notification_icon', 
    },
    body: translations[_language as keyof typeof translations].WalletConnect[translation_setting][1],
    
    title: translations[_language as keyof typeof translations].WalletConnect[translation_setting][0],
  };
  
  await notifee.displayNotification(notificationPayload);
}
export async function createSignClient() {
  try {
    const initConfig = {
      metadata: {
        description: 'Xucre Wallet',
        icons: ['https://pixeltagimagehost.s3.us-west-1.amazonaws.com/xucre-icon.png'],
        name: 'Xucre Wallet',
        url: env.REACT_APP_XUCRE_WALLET_SCHEME,
        redirect: {
          native: env.REACT_APP_XUCRE_WALLET_SCHEME
        }
      },    
      projectId: env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
      relayUrl: 'wss://relay.walletconnect.com'
    };
    signClient = await SignClient.init(initConfig)
    registerListeners();
    return signClient;
  } catch (err) {
    return;
  }
  
}

export const registerListeners = () => {
  
  if (signClient) {
    signClient.on("session_proposal", (event) => {
      const id = nanoid();
      if (AppState.currentState === 'active') {
        navigate('ConnectionRequest', {
          requestDetails: event
        })
      } else {
        addNotification(String(event.id), event);
        onDisplayNotification(String(event.id), 'session_proposal');
      }
    });

    signClient.on("session_event", (event) => {
      // Handle session events, such as "chainChanged", "accountsChanged", etc.
    });

    signClient.on("session_request", (event) => {
      // Handle session method requests, such as "eth_sign", "eth_sendTransaction", etc.
      //const id = nanoid();
      addNotification(String(event.id), event);
      if (
        event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA ||
        event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3 ||
        event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4
      ) {
        if (AppState.currentState === 'active') {
          navigate('SignTyped', {
            requestDetails: event
          })
        } else {
          onDisplayNotification(String(event.id), 'session_request_sign_tx');
        }
      } else if(
        event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN ||
        event.params.request.method === EIP155_SIGNING_METHODS.PERSONAL_SIGN
      ) {
        if (AppState.currentState === 'active') {
          navigate('SignEth', {
            requestDetails: event
          })
        } else {
          onDisplayNotification(String(event.id), 'session_request_sign_tx');
        }
      } else if(
        event.params.request.method === EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION
      ) {
        if (AppState.currentState === 'active') {
          navigate('SignTransaction', {
            requestDetails: event
          })
        } else {
          onDisplayNotification(String(event.id), 'session_request_sign_tx');
        }
        
      } else if(
        event.params.request.method === EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION
      ) {
        if (AppState.currentState === 'active') {
          navigate('SendTransaction', {
            requestDetails: event
          })
        } else {
          onDisplayNotification(String(event.id), 'session_request_send_tx');
        }
      } else {
        //
      }
    });

    signClient.on("session_ping", (event) => {
      // React to session ping event
    });

    signClient.on("session_delete", (event) => {
      // React to session delete event
      signClient.core.pairing.disconnect({ topic: event.topic });
    });

    signClient.on("session_update", ({ topic, params }) => {
      // React to session delete event
      const { namespaces } = params;
      const _session = signClient.session.get(topic)
      // Overwrite the `namespaces` of the existing session with the incoming one.
      const updatedSession = { ..._session, namespaces }
      // Integrate the updated session state into your dapp state.
      //onSessionUpdate(updatedSession)
    });

    signClient.on("session_extend", (event) => {
      // React to session delete event
    });

    signClient.on("session_request_sent", (event) => {
      // React to session delete event
    });

    signClient.on("proposal_expire", (event) => {
      deleteNotification(String(event.id))
      if (AppState.currentState === 'active') {
        navigate('ViewWallet', {});
      } 
    });

    signClient.core.pairing.events.on("pairing_delete", ({ id, topic }) => {
      //
    });

    signClient.core.pairing.events.on("pairing_ping", ({ id, topic }) => {
    });

    signClient.core.pairing.events.on("pairing_expire", ({ id, topic }) => {
    });
  } else {
  }
}

