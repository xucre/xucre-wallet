
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
import GuestLayout from "../../../layouts/GuestLayout";
import { approveEIP155Request, rejectEIP155Request } from "../../../service/eip1155Utils";
import { language as stateLanguage, walletList } from "../../../service/state";
import { goBack } from "../../../service/walletConnect";
import { deleteNotification } from "../../../store/setting";
import ContainedButton from "../../../components/ui/ContainedButton";
import GhostButton from "../../../components/ui/GhostButton";
import { useSignClient } from "../../../hooks/useSignClient";

export default function SignTypedData({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { requestDetails } = route.params;
  const [request, setRequest] = useState({} as any);
  const [domain, setDomain] = useState({} as any);
  const [types, setTypes] = useState({});
  const [value, setValue] = useState({} as any);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState,] = useRecoilState(walletList);
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [page, setPage] = useState(0);
  const signClient = useSignClient();
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
      setWalletAddress(request['params']['request']['params'][0]);
      const rawData = request['params']['request']['params'][1];
      const data = JSON.parse(rawData);

      setDomain(data.domain);
      setTypes(data.types);
      setValue(data.message);
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
        {request && request['params'] && value && value['contents'] &&
          <Box>
            <VStack height={'3/4'}>
              <Center mt={5}>
                <Heading size="md" mb={4}><Text>{translations[language as keyof typeof translations].SignTyped.header}</Text></Heading>
                <Heading size="sm" mb={4}><Text>{translations[language as keyof typeof translations].SignTyped.header_origin}{domain['name']}</Text></Heading>
              </Center>

              <Box m={2} p={2} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                <ScrollView height={'50%'} width={'100%'} >
                  <Text>{JSON.stringify(value)}</Text>
                </ScrollView>
              </Box>


            </VStack>
            <VStack space={1}>
              <ContainedButton isLoading={loading} buttonText={translations[language as keyof typeof translations].SignTyped.approve_button} onPress={approve} />
              <GhostButton isLoading={loading} buttonText={translations[language as keyof typeof translations].SignTyped.reject_button} onPress={reject} />
            </VStack>
          </Box>
        }
      </Box>
    </GuestLayout>
  );
}