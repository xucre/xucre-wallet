import SignClient from '@walletconnect/sign-client';

import { env } from './constants';

// eslint-disable-next-line functional/no-let
let navigation;

// eslint-disable-next-line functional/no-let
export let signClient: SignClient;

export async function createSignClient() {
  signClient = await SignClient.init({
    /*metadata: {
      description: 'Xucre Wallet',
      icons: ['https://pixeltagimagehost.s3.us-west-1.amazonaws.com/xucre-icon.png'],
      name: 'React Wallet',
      url: env.REACT_APP_XUCRE_WALLET_SCHEME,
    },*/    
    projectId: env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
    //relayUrl: env.REACT_APP_WALLET_CONNECT_RELAY_URL,
  })
  //console.log(signClient);
  registerListeners();
}

export function setNavigation(nav) {
  navigation = nav;
}
export const registerListeners = () => {
  if (signClient) {
    signClient.on("session_proposal", (event) => {
      // Show session proposal data to the user i.e. in a modal with options to approve / reject it
      console.log('session_proposal',event);
      /*interface Event {
        id: number;
        params: {
          id: number;
          expiry: number;
          relays: { protocol: string; data?: string }[];
          proposer: {
            publicKey: string;
            metadata: {
              name: string;
              description: string;
              url: string;
              icons: string[];
            };
          };
          requiredNamespaces: Record<
            string,
            {
              chains: string[];
              methods: string[];
              events: string[];
              extension?: {
                chains: string[];
                methods: string[];
                events: string[];
              }[];
            }
          >;
          pairingTopic?: string;
        };
      }*/
    });

    signClient.on("session_event", (event) => {
      // Handle session events, such as "chainChanged", "accountsChanged", etc.
      console.log(event);
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
      console.log(event);
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
      console.log(event);
      /*interface Event {
        id: number;
        topic: string;
      }*/
    });

    signClient.on("session_delete", (event) => {
      // React to session delete event
      console.log(event);
      /*interface Event {
        id: number;
        topic: string;
      }*/
    });
  }
}

