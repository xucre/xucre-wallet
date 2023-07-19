import { MaterialIcons } from "@expo/vector-icons";
import { JsonRpcResponse, JsonRpcResult } from "@json-rpc-tools/utils";
import { ethers } from 'ethers';
import {
  AlertDialog,
  ArrowBackIcon,
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Drawer,
  Heading,
  Hidden,
  HStack,
  Icon,
  IconButton,
  Image,
  MoonIcon,
  Pressable,
  ScrollView,
  SunIcon,
  Text,
  TextArea,
  Tooltip,
  useColorMode,
  useColorModeValue,
  VStack,
} from "native-base";
import React, {useEffect, useState} from "react";
import { useRecoilState } from "recoil";

import translations from "../../../assets/translations";
import { EIP155_SIGNING_METHODS } from "../../../data/EIP1155Data"; 
import GuestLayout from "../../../layouts/GuestLayout";
import { approveEIP155Request, rejectEIP155Request } from "../../../service/eip1155Utils";
import { language as stateLanguage, walletList } from "../../../service/state";
import { truncateString } from "../../../service/utility";
import { signClient } from "../../../service/walletConnect";

export default function SignTransaction({navigation, route}) {
  const {requestDetails} = route.params;
  const {colorMode} = useColorMode();
  const [request, setRequest] = useState({});
  const [to, setTo] = useState('');
  const [data, setData] = useState('');
  const [method, setMethod] = useState('');
  const [value, setValue] = useState({});
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState, ] = useRecoilState(walletList);
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [page, setPage] = useState(0);
  const [language, ] = useRecoilState(stateLanguage);
  useEffect(() => {
    const runAsync = async () => {
      if (requestDetails) {
        //console.log(requestDetails);
        setRequest(requestDetails);
      }
    }

    runAsync();
  }, [requestDetails]);

  useEffect(() => {
    if (Object.keys(request).length > 0) {
      setMethod(request['params']['request']['method']);
      if (request['params']['request']['method'] === EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION) {
        setWalletAddress(request['params']['request']['params'][0]['from']);
        setTo(request['params']['request']['params'][0]['to'])
      }
      setValue(request['params']['request']['params'][0]);
    }
  }, [request])


  const approve = async () => {
    const response = await approveEIP155Request(request, walletState);
    const clientResponse = await signClient.respond({
      response,
      topic: request['topic'],
    })
    console.log(response, clientResponse);
    navigation.navigate('ViewWallet');
  }

  const reject = async () => {
    const response = rejectEIP155Request(request)
    await signClient.respond({
      response,
      topic: request['topic'],
    })
    navigation.navigate('ViewWallet');    
  }

  return (
    <GuestLayout>
      <Box         
        _light={{ backgroundColor: 'white' }}
        _dark={{ backgroundColor: '#1b1e24' }}
        height={'100%'}
      >
        {request && request['params'] && 
          <Box>
            <VStack height={'90%'}>
              <Center mt={5}>          
                <Heading size="md" mb={4}><Text>{translations[language].SignTransaction.header}</Text></Heading>              
              </Center>
              
              <Box m={2} p={2} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                <ScrollView height={'50%'} width={'100%'} >
                  <Text>{JSON.stringify(value, null, 2)}</Text>                    
                </ScrollView>
              </Box>
              
              
            </VStack>
            <Button.Group isAttached colorScheme={colorMode === 'dark' ? 'primary' : 'tertiary'} >
              <Button onPress={approve} variant={'solid'} rounded="none" size={'1/2'} my={6}><Text>{translations[language].SignTransaction.approve_button}</Text></Button>
              <Button onPress={reject} variant={'outline'} rounded="none" size={'1/2'} my={6}><Text>{translations[language].SignTransaction.reject_button}</Text></Button>
            </Button.Group>
          </Box>
        }        
      </Box>
    </GuestLayout>
  );
}