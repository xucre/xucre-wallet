import notifee, { AndroidLaunchActivityFlag } from '@notifee/react-native';
import { Core } from '@walletconnect/core'
import { Web3Wallet, IWeb3Wallet, Web3WalletTypes } from '@walletconnect/web3wallet'
import {AppState} from 'react-native';

import translations from "../assets/translations";
import { EIP155_SIGNING_METHODS } from "../data/EIP1155Data";
import { getLanguage } from '../store/language';
import { addNotification, deleteNotification } from '../store/setting';

import { navigate } from './RootNavigation';
import { env } from './constants';
import { getWallets } from '../store/wallet';
import { buildApprovedNamespaces } from '@walletconnect/utils';
const core = new Core({
  projectId: env.REACT_APP_WALLET_CONNECT_PROJECT_ID
})

// eslint-disable-next-line functional/no-let
export let signClient:IWeb3Wallet;
let hasLoaded = false;

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

const approveAutomatically = async (request: Web3WalletTypes.SessionProposal) => {
  const walletList = await getWallets();
  const accountList = walletList.map((wallet) => {
    return [`eip155:1:${wallet.address}`, `eip155:137:${wallet.address}`];
  })
  const chainList = ['eip155:1', 'eip155:137'];

  const eventList = ['eth_sendTransaction', 'personal_sign', 'eth_sign'];

  const methodList = [EIP155_SIGNING_METHODS.ETH_SEND_RAW_TRANSACTION, EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION, EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA, EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3, EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4, EIP155_SIGNING_METHODS.PERSONAL_SIGN, EIP155_SIGNING_METHODS.ETH_SIGN]

  const payload = buildApprovedNamespaces({
    proposal: request['params'],
    supportedNamespaces: {
      eip155: {
        chains: chainList || ['eip155:1', 'eip155:137'],
        accounts: accountList.flat(),
        events: eventList,
        methods: methodList,
      },
    },
  });

  const { topic, acknowledged } = await signClient.approveSession({
    id: request['params']['id'],
    namespaces: payload
  });


}

export async function createSignClient() {
  
  if (hasLoaded) return signClient;

  const initConfig = {
    core,
    metadata: {
      description: 'Xucre Wallet',
      icons: ['https://pixeltagimagehost.s3.us-west-1.amazonaws.com/xucre-icon.png'],
      name: 'Xucre Wallet',
      url: env.REACT_APP_XUCRE_WALLET_SCHEME,
      redirect: {
        native: env.REACT_APP_XUCRE_WALLET_SCHEME
      }
    },    
  };
  
  signClient = await Web3Wallet.init(initConfig);
  //signClient = await SignClient.init(initConfig)
  if (signClient) {
    signClient.on("session_proposal", (event) => {
      /*if (event.verifyContext.verified.origin === 'https://swap.xucre.net') {
        approveAutomatically(event);
      } else*/ if (AppState.currentState === 'active') {
        navigate('ConnectionRequest', {
          requestDetails: event
        })
      } else {
        addNotification(String(event.id), event);
        onDisplayNotification(String(event.id), 'session_proposal');
      }
    });

    signClient.on("session_request", (event) => {
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


    signClient.on("session_delete", (event) => {
      // React to session delete event
      signClient.core.pairing.disconnect({ topic: event.topic });
    });

    signClient.on("proposal_expire", (event) => {
      deleteNotification(String(event.id))
      if (AppState.currentState === 'active') {
        navigate('ViewWallet', {});
      } 
    });
  }
  hasLoaded = true;  

  return signClient;
 
  
}

