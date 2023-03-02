import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import LegacySignClient from '@walletconnect/client'
import { IWalletConnectSession } from '@walletconnect/legacy-types'
import { getSdkError } from '@walletconnect/utils'
import { providers, utils } from 'ethers'
import { useRecoilState } from "recoil";

import { EIP155_SIGNING_METHODS } from "../data/EIP1155Data"; 
import { getWCLegacyUrl, storeWCLegacyUrl } from '../store/setting';

import { navigate } from './RootNavigation';
import { env } from './constants';
import { language as stateLanguage, walletList } from "./state";

// eslint-disable-next-line functional/no-let
export let legacySignClient: LegacySignClient;

export const createLegacySignClient = async ({ uri }: { readonly uri?: string } = {}) => {
  // If URI is passed always create a new session,
  // otherwise fall back to cached session if client isn't already instantiated.
  if (uri) {
    deleteCachedLegacySession();
    console.log('creating legacy client');
    legacySignClient = new LegacySignClient({ uri })
  } else if (!legacySignClient) {    
    console.log('retrieving2 legacy client');
    getCachedLegacySession().then((local) => {
      if (local && local !== '') {
        console.log('local',local);
        const session : IWalletConnectSession = JSON.parse(local);
        //console.log(session);
        legacySignClient = new LegacySignClient({ session })
      } 
    });
      
  } else {
    console.log('not retrieving legacy client');
    return
  }

  if (legacySignClient) {
    legacySignClient.on('session_request', (error, payload) => {
      if (error) {
        console.log(`legacySignClient > session_request failed: ${error}`)
      } else {
        //console.log('session_request', payload);
      }
      //console.log('session request', payload);
      //storeWCLegacyUrl(uri);
      navigate('LegacyConnectionRequest', {
        requestDetails: payload
      })
      //ModalStore.open('LegacySessionProposalModal', { legacyProposal: payload })
    })

    legacySignClient.on('connect', () => {
      console.log('legacySignClient > connect')
    })

    legacySignClient.on('error', error => {
      console.log(`legacySignClient > on error: ${error}`)
    })

    legacySignClient.on('call_request', (error, payload) => {
      if (error) {
        console.log(`legacySignClient > call_request failed: ${error}`)
      }
      //console.log('call_request', payload);
      onCallRequest(payload)
    })

    legacySignClient.on('disconnect', async () => {
      deleteCachedLegacySession();
      console.log('legacySignClient > disconnect');
    })
  }
  
}

const onCallRequest = async (payload: { readonly id: number; readonly method: string; readonly params: readonly any[] }) => {
  switch (payload.method) {
    case EIP155_SIGNING_METHODS.ETH_SIGN:
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      return navigate('LegacyEthSign', {
        requestDetails: payload
      })

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      return navigate('LegacySignTypedData', {
        requestDetails: payload
      })

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      return navigate('LegacySendTransaction', {
        requestDetails: payload
      })
    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      navigate('LegacySignTransaction', {
        requestDetails: payload
      })
  }
}

function getCachedLegacySession(): Promise<string>{
  return getWCLegacyUrl();  
}

function deleteCachedLegacySession() {
  console.log('delete session');
  storeWCLegacyUrl('')
}