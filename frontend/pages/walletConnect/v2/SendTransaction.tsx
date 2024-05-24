
import { BigNumber, ethers } from 'ethers';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Text,
  useColorMode,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { Color } from "../../../../GlobalStyles";
import translations from "../../../assets/translations";
import GuestLayout from "../../../layouts/GuestLayout";
import { approveEIP155Request, rejectEIP155Request } from "../../../service/eip1155Utils";
import { language as stateLanguage, walletList } from "../../../service/state";
import { goBack, signClient } from "../../../service/walletConnect";
import { deleteNotification } from "../../../store/setting";
import ContainedButton from '../../../components/ui/ContainedButton';
import GhostButton from '../../../components/ui/GhostButton';
import { useMixpanel } from '../../../hooks/useMixpanel';

export default function SendTransaction({ navigation, route }: { navigation: { navigate: Function }, route: any }) {
  const { colorMode } = useColorMode();
  const { requestDetails } = route.params;
  const mixpanel = useMixpanel();
  const [request, setRequest] = useState({} as any);
  const [to, setTo] = useState('');
  const [data, setData] = useState('');
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [value, setValue] = useState({});
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState,] = useRecoilState(walletList);
  const [viewData, setViewData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language,] = useRecoilState(stateLanguage);
  useEffect(() => {
    let isMounted = true;
    const runAsync = async () => {
      if (requestDetails) {
        if (isMounted) setRequest(requestDetails);
      }
    }

    try {
      // Send event to Mixpanel
      mixpanel.track("view_page", { "page": "Send Transaction", "dApp": requestDetails['verifyContext']['origin'] });
    } catch (err2: any) { }

    runAsync();
    return () => { isMounted = false }
  }, [requestDetails]);

  useEffect(() => {
    if (Object.keys(request).length > 0) {
      setMethod(request['params']['request']['method']);
      setWalletAddress(request['params']['request']['params'][0]['from']);
      setTo(request['params']['request']['params'][0]['to']);
      setAmount(BigNumber.from(request['params']['request']['params'][0]['value']));
      setValue(request['params']['request']['params'][0]);
    }
  }, [request])

  const StyledItem = ({ label, value }: { label: string, value: string }) => {
    return (
      <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{ bgColor: 'coolGray.800' }} _light={{ bgColor: 'coolGray.300' }}>
        <VStack space={0}>
          <Text fontSize="sm" color="coolGray.500">
            {label}
          </Text>
          <Text>{value}</Text>
        </VStack>
      </HStack>
    );
  }

  const StyledAmount = () => {
    return (
      <FormControl>
        <FormControl.Label>{translations[language as keyof typeof translations].LegacySendTransaction.amount}</FormControl.Label>
        <Input fontSize={'5xl'} variant="underlined" value={ethers.utils.formatEther(amount)} isReadOnly={true} />
      </FormControl>
    )
  }

  const CustomTextAreaOverlay = ({ data }: { data: string }) => {
    return (
      <Box borderRadius={'md'} w={'full'} borderColor={'gray.300'} borderStyle={'solid'} h={'1/4'} borderWidth={1}>
        <ScrollView w={'full'} maxH={'full'}>
          <Text color={'gray.500'}>{data}</Text>
        </ScrollView>
      </Box>

    );
  };

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
    // Send event to Mixpanel
    mixpanel.track("core_action", { "page": "Send Transaction", "action": "Transaction Approved", "wallet": walletAddress, "dApp": requestDetails['verifyContext']['origin'] });

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
      <Center
        _light={{ backgroundColor: Color.white }}
        _dark={{ backgroundColor: Color.black }}
        height={'100%'}
      >
        {request && request['params'] &&
          <VStack>
            <VStack>
              {/*<Center mt={5}>          
                <Heading size="md" mb={4}><Text>{'SendTransaction'}</Text></Heading>              
              </Center>*/}
              <Box mx={2} px={2} >
                <StyledAmount />
                <HStack alignItems={'flex-end'}>
                  {!viewData &&
                    <Button variant={'ghost'} onPress={() => setViewData(true)}>{translations[language as keyof typeof translations].SendTransaction.view_data}</Button>
                  }
                  {viewData &&
                    <Button variant={'ghost'} onPress={() => setViewData(false)}>{translations[language as keyof typeof translations].SendTransaction.hide_data}</Button>
                  }
                </HStack>
                {viewData &&
                  <CustomTextAreaOverlay data={JSON.stringify(value)} />
                }
              </Box>

              {/*<Box m={2} p={2} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                <ScrollView height={'50%'} width={'100%'} >
                  <Text>{JSON.stringify(value)}</Text>                    
                </ScrollView>
              </Box>*/}
              <VStack m={2} p={2} space={2}>
                <StyledItem label={translations[language as keyof typeof translations].SendTransaction.from} value={walletAddress} />
                <StyledItem label={translations[language as keyof typeof translations].SendTransaction.to} value={to} />
              </VStack>
            </VStack>

            <VStack space={1}>
              <ContainedButton isLoading={loading} buttonText={translations[language as keyof typeof translations].SendTransaction.approve_button} onPress={approve} />
              <GhostButton isLoading={loading} buttonText={translations[language as keyof typeof translations].SendTransaction.reject_button} onPress={reject} />
            </VStack>
          </VStack>
        }
      </Center>
    </GuestLayout>
  );
}