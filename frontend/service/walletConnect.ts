import SignClient from '@walletconnect/sign-client';

import { navigate } from './RootNavigation';
import { env } from './constants';

// eslint-disable-next-line functional/no-let
export let signClient: SignClient;

export async function createSignClient() {
  signClient = await SignClient.init({
    metadata: {
      description: 'Xucre Wallet',
      icons: ['https://pixeltagimagehost.s3.us-west-1.amazonaws.com/xucre-icon.png'],
      name: 'Xucre Wallet',
      url: env.REACT_APP_XUCRE_WALLET_SCHEME,
    },    
    projectId: env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
    //relayUrl: env.REACT_APP_WALLET_CONNECT_RELAY_URL,
  })
  //console.log(signClient);
  registerListeners();
}

export const registerListeners = () => {
  if (signClient) {
    signClient.on("session_proposal", (event) => {
      console.log('session_proposal');
      navigate('ConnectionRequest', {
        requestDetails: event
      })
    });

    signClient.on("session_event", (event) => {
      // Handle session events, such as "chainChanged", "accountsChanged", etc.
      console.log('session_event', event);
      /*interface Event {
        id: number;
        topic: string;
        params: {
          event: { name: string; data: any };
          chainId: string;
        };
      }*/
    });

    signClient.on("session_request", (event) => {
      // Handle session method requests, such as "eth_sign", "eth_sendTransaction", etc.
      
      if (event.params.request.method === 'eth_signTypedData') {
        navigate('SignTyped', {
          requestDetails: event
        })
      } else {
        console.log('session_request', event);
      }
      /*interface Event {
        id: number;
        topic: string;
        params: {
          request: { method: string; params: any };
          chainId: string;
        };
      }*/
    });

    signClient.on("session_ping", (event) => {
      // React to session ping event
      console.log('session_ping', event);
    });

    signClient.on("session_delete", (event) => {
      // React to session delete event
      console.log('session_delete', event);
    });
  }
}

