
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
import { signClient } from "../../../service/walletConnect";
import { deleteNotification } from "../../../store/setting";

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
  const [language,] = useRecoilState(stateLanguage);
  useEffect(() => {
    const runAsync = async () => {
      if (requestDetails) {
        setRequest(requestDetails);
      }
    }

    runAsync();
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
    navigation.navigate('ViewWallet');
  }

  const reject = async () => {
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
    navigation.navigate('ViewWallet');
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
            <VStack height={'90%'}>
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
            <Button.Group isAttached colorScheme="blue" >
              <Button onPress={approve} variant={'solid'} rounded="none" size={'1/2'} my={6}><Text>{translations[language as keyof typeof translations].SignTyped.approve_button}</Text></Button>
              <Button onPress={reject} variant={'outline'} rounded="none" size={'1/2'} my={6}><Text>{translations[language as keyof typeof translations].SignTyped.reject_button}</Text></Button>
            </Button.Group>
          </Box>
        }
      </Box>
    </GuestLayout>
  );
}