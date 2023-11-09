
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
import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import { Color } from "../../../../GlobalStyles";
import translations from "../../../assets/translations";
import GuestLayout from "../../../layouts/GuestLayout";
import { approveEIP155Request, rejectEIP155Request } from "../../../service/eip1155Utils";
import { language as stateLanguage, walletList } from "../../../service/state";
import { signClient } from "../../../service/walletConnect";
import { deleteNotification } from "../../../store/setting";

export default function SendTransaction({navigation, route}: {navigation: {navigate: Function}, route: any}) {
  const {colorMode} = useColorMode();
  const {requestDetails} = route.params;
  const [request, setRequest] = useState({} as any);
  const [to, setTo] = useState('');
  const [data, setData] = useState('');
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState(BigNumber.from(0));
  const [value, setValue] = useState({});
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState, ] = useRecoilState(walletList);
  const [viewData, setViewData] = useState(false);
  const [language, ] = useRecoilState(stateLanguage);
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
      
      setMethod(request['params']['request']['method']);
      setWalletAddress(request['params']['request']['params'][0]['from']);
      setTo(request['params']['request']['params'][0]['to']);
      setAmount(BigNumber.from(request['params']['request']['params'][0]['value']));
      setValue(request['params']['request']['params'][0]);
    }
  }, [request])

  const StyledItem = ({label, value} : {label:string,value:string}) => {
    return (
      <HStack alignItems="center" justifyContent="space-between" p={3} py={4} borderRadius={25} _dark={{bgColor: 'coolGray.800'}} _light={{bgColor: 'coolGray.300'}}>   
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
        <Input fontSize={'5xl'} variant="underlined" value={ethers.utils.formatEther(amount)} isReadOnly={true}/>
      </FormControl>
    )
  }

  const CustomTextAreaOverlay = ({ data } :{data: string}) => {
    return (
      <Box borderRadius={'md'} w={'full'} borderColor={'gray.300'} borderStyle={'solid'} h={'1/4'} borderWidth={1}> 
        <ScrollView w={'full'} maxH={'full'}>
          <Text color={'gray.500'}>{data}</Text>
        </ScrollView>
      </Box>
      
    );
  };

  const approve = async () => {
    const response = await approveEIP155Request(request, walletState);
    await signClient.respond({
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
    await signClient.respond({
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
            <Button.Group isAttached colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'}  >
              <Button onPress={approve} variant={'solid'} rounded="none" size={'1/2'} my={6}><Text color={colorMode === 'dark' ? Color.black : Color.white } fontWeight={'bold'}>{translations[language as keyof typeof translations].LegacySendTransaction.approve_button}</Text></Button>
              <Button onPress={reject} variant={'outline'} rounded="none" size={'1/2'} my={6}><Text>{translations[language as keyof typeof translations].SendTransaction.reject_button}</Text></Button>
            </Button.Group>
          </VStack>
        }        
      </Center>
    </GuestLayout>
  );
}