import '@walletconnect/react-native-compat';
import React from 'react';
import Client from '@walletconnect/web3wallet'
import { createSignClient } from '../service/walletConnect';
import { useToast } from 'native-base';
import translations from '../assets/translations';
import { language } from '../service/state';
import { useRecoilState } from 'recoil';


const SignClientContext = React.createContext({} as Client);

export const useSignClient = () => React.useContext(SignClientContext);

export const SignClientProvider = ({ children }: { children: any }) => {
  const toast = useToast();
  const [_language,] = useRecoilState(language);
  const [signClient, setSignClient] = React.useState({} as Client);

  React.useEffect(() => {
    const init = async () => {
      try {
        const _signClient = await createSignClient();
        setSignClient(_signClient);
      } catch (err) {
        toast.show({ description: `${translations[_language as keyof typeof translations].Toast.sign_client_error} ${JSON.stringify(err)}` });
      }
    }
    init()
  }, []);

  return <SignClientContext.Provider value={signClient}>{children}</SignClientContext.Provider>;
};