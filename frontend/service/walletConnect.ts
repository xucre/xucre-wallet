
import '@walletconnect/react-native-compat';
import notifee, { AndroidLaunchActivityFlag } from '@notifee/react-native';
import { Core } from '@walletconnect/core'
import Client, { Web3Wallet, IWeb3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'
import {AppState, Linking, Platform} from 'react-native';

import translations from "../assets/translations";
import { EIP155_SIGNING_METHODS } from "../data/EIP1155Data";
import { getLanguage } from '../store/language';
import { addNotification, deleteNotification } from '../store/setting';

import { navigate } from './RootNavigation';
import { env } from './constants';
import { getWallets } from '../store/wallet';
import { buildApprovedNamespaces } from '@walletconnect/utils';
import { Toast } from 'native-base';
const core = Platform.OS === 'android' ? new Core({
  projectId: env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  relayUrl: env.REACT_APP_WALLET_CONNECT_RELAY_URL,
}) : new Core({
  projectId: env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  relayUrl: env.REACT_APP_WALLET_CONNECT_RELAY_URL,
})

async function onDisplayNotification(id: string, translation_setting: string) {
  try {
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
  } catch (err) {}
}

const sessionProposal = (event: Web3WalletTypes.SessionProposal) => {
  navigate('ConnectionRequest', {
    requestDetails: event
  })
  if (AppState.currentState !== 'active') {
    addNotification(String(event.id), event);
    onDisplayNotification(String(event.id), 'session_proposal');
  }
}

const sessionRequest = (event: Web3WalletTypes.SessionRequest) => {
  // Handle session method requests, such as "eth_sign", "eth_sendTransaction", etc.
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
    } else if (AppState.currentState === 'background') {
      onDisplayNotification(String(event.id), 'session_request_sign_tx');
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
    } else if (AppState.currentState === 'background') {
      onDisplayNotification(String(event.id), 'session_request_sign_tx');
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
    } else if (AppState.currentState === 'background') {
      onDisplayNotification(String(event.id), 'session_request_sign_tx');
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
    } else if (AppState.currentState === 'background') {
      onDisplayNotification(String(event.id), 'session_request_sign_tx');
      navigate('SendTransaction', {
        requestDetails: event
      })
    } else {
      onDisplayNotification(String(event.id), 'session_request_send_tx');
    }
  } else {
    //
  }
}

const sessionDelete = (event: Web3WalletTypes.SessionDelete) => {
  // React to session delete event
  console.log('sessionDelete', event);
  try {
    //signClient.core.pairing.disconnect({ topic: event.topic });
  } catch (err) {}  
}

const proposalExpire = (event: Web3WalletTypes.ProposalExpire) => {
  deleteNotification(String(event.id))
  if (AppState.currentState === 'active') {
    navigate('ViewWallet', {});
  } 
}

export async function createSignClient() {
  console.log(`createSignClient is loading...`);
  //if (hasLoaded && signClient) return signClient;
  const scheme = Platform.OS === 'android' ? env.REACT_APP_XUCRE_WALLET_SCHEME : env.REACT_APP_XUCRE_WALLET_SCHEME_IOS;
  
  const initConfig = Platform.OS === 'ios' && !__DEV__ ? 
  {
    core: { ...core, opts: { relayUrl: env.REACT_APP_WALLET_CONNECT_RELAY_URL } }, 
    metadata: {
      description: 'Xucre Wallet',
      icons: ['https://pixeltagimagehost.s3.us-west-1.amazonaws.com/xucre-icon.png'],
      name: 'Xucre Wallet',
      url: scheme,
      redirect: {
        native: scheme
      }
    },
  } as unknown as Web3WalletTypes.Options : 
  {
    core,
    metadata: {
      description: 'Xucre Wallet',
      icons: ['https://pixeltagimagehost.s3.us-west-1.amazonaws.com/xucre-icon.png'],
      name: 'Xucre Wallet',
      url: scheme,
      redirect: {
        native: scheme
      }
    },
  } as Web3WalletTypes.Options;
  
  const signClient = await Web3Wallet.init(initConfig);
  Toast.show({ title: 'Client Initialized', description: `${signClient.name}`})
  //console.log(signClient)
  //signClient = await SignClient.init(initConfig)
  if (signClient) {
    signClient.on("session_proposal", sessionProposal);
    signClient.on("session_request", sessionRequest);
    signClient.on("session_delete", sessionDelete);
    signClient.on("proposal_expire", proposalExpire);
  }
  //hasLoaded = true;  

  return signClient;
  
}

export function parseRequestParams(params: {optionalNamespaces: {eip155: {"chains": string[], "events": string[], "methods": string[]}}, requiredNamespaces: {eip155: {"chains": string[], "events": string[], "methods": string[]}}}) {
  const { optionalNamespaces, requiredNamespaces } = params;
  const chainList = requiredNamespaces?.eip155?.chains || optionalNamespaces?.eip155?.chains || ['eip155:1'];
  const eventList = requiredNamespaces?.eip155?.events || optionalNamespaces?.eip155?.events || ['eth_sendTransaction', 'personal_sign', 'eth_sign'];
  const methodList = requiredNamespaces?.eip155?.methods || optionalNamespaces?.eip155?.methods || [EIP155_SIGNING_METHODS.ETH_SEND_RAW_TRANSACTION, EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION, EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA, EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3, EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4, EIP155_SIGNING_METHODS.PERSONAL_SIGN, EIP155_SIGNING_METHODS.ETH_SIGN];

  return {
    chainList,
    eventList,
    methodList
  };
}

export async function goBack (request: any, navigation: {navigate: Function}) {
  if (
    request['verifyContext']['verified']['origin'] === 'https://swap.xucre.net'
  ) {
    navigation.navigate('SwapToken');
  } else if (
    
    request['verifyContext']['verified']['origin'] === 'https://app.ubeswap.org'
  ) {
    navigation.navigate('Ubeswap');
  } else if (
    request['verifyContext']['verified']['origin'] === 'https://ethix.ethichub.com'
  ) {
    navigation.navigate('EthicHub');
  } else {
    navigation.navigate('ViewWallet');
  }
}
