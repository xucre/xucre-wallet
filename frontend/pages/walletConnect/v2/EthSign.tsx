import {
  Box,
  Button,
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Color } from "../../../../GlobalStyles";
import translations from "../../../assets/translations";
import { EIP155_SIGNING_METHODS } from "../../../data/EIP1155Data";
import GuestLayout from "../../../layouts/GuestLayout";
import { approveEIP155Request, rejectEIP155Request } from "../../../service/eip1155Utils";
import { language as stateLanguage, walletList } from "../../../service/state";
import { goBack, signClient } from "../../../service/walletConnect";
import { deleteNotification } from "../../../store/setting";
import ContainedButton from "../../../components/ui/ContainedButton";
import GhostButton from "../../../components/ui/GhostButton";

export default function EthSign({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { requestDetails } = route.params;
  const [request, setRequest] = useState({} as any);
  const [method, setMethod] = useState('');
  const [value, setValue] = useState({} as any);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState,] = useRecoilState(walletList);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      if (requestDetails) {
        if (isMounted) setRequest(requestDetails);
      }
    }

    runAsync();
    return () => { isMounted = false }
  }, [requestDetails]);

  useEffect(() => {
    if (Object.keys(request).length > 0) {
      setMethod(request['params']['request']['method']);
      if (request['params']['request']['method'] === EIP155_SIGNING_METHODS.ETH_SIGN) {
        setWalletAddress(request['params']['request']['params'][0]);
      }
      if (request['params']['request']['method'] === EIP155_SIGNING_METHODS.PERSONAL_SIGN) {
        setWalletAddress(request['params']['request']['params'][1]);
      }
      setValue(request['params']['request']['params']);
    }
  }, [request])


  const approve = async () => {
    setLoading(true);
    const response = await approveEIP155Request(request, walletState);
    await signClient.respondSessionRequest({
      response,
      topic: request['topic'],
    })
    try {
      await deleteNotification(String(request['id']));
    } catch (err) {
      //
    }
    setLoading(false);
    goBack(request, navigation);
  }

  const reject = async () => {
    setLoading(true);
    const response = rejectEIP155Request(request)
    await signClient.respondSessionRequest({
      response,
      topic: request['topic'],
    })
    try {
      await deleteNotification(String(request['id']));
    } catch (err) {
      //
    }
    setLoading(false);
    goBack(request, navigation);
  }

  return (
    <GuestLayout>
      <Box
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        height={'100%'}
      >
        {request && request['params'] &&
          <Box>
            <VStack height={'3/4'}>
              <Center mt={5}>
                <Heading size="md" mb={4}><Text>{translations[language as keyof typeof translations].SignEth.header}</Text></Heading>
              </Center>

              <Box m={2} p={2} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                <ScrollView height={'50%'} width={'100%'} >
                  <Text>{JSON.stringify(value)}</Text>
                </ScrollView>
              </Box>


            </VStack>
            <VStack space={1}>
              <ContainedButton isLoading={loading} buttonText={translations[language as keyof typeof translations].SignEth.approve_button} onPress={approve} />
              <GhostButton isLoading={loading} buttonText={translations[language as keyof typeof translations].SignEth.reject_button} onPress={reject} />
            </VStack>
          </Box>
        }
      </Box>
    </GuestLayout>
  );
}