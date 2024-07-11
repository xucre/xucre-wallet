import '@walletconnect/react-native-compat';
import React from 'react';
import Client from '@walletconnect/web3wallet'
import { createSignClient } from '../service/walletConnect';
import { useToast } from 'native-base';


const SignClientContext = React.createContext({} as Client);

export const useSignClient = () => React.useContext(SignClientContext);

export const SignClientProvider = ({ children }: { children: any }) => {
  const toast = useToast();
  const [signClient, setSignClient] = React.useState({} as Client);

  React.useEffect(() => {
    const init = async () => {
      try {
        const _signClient = await createSignClient();
        setSignClient(_signClient);
      } catch (err) {
        toast.show({ description: `Error creating sign client ${JSON.stringify(err)}` });
      }
    }
    init()
  }, []);

  return <SignClientContext.Provider value={signClient}>{children}</SignClientContext.Provider>;
};