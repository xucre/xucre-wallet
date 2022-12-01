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
import { legacySignClient } from "../../../service/walletConnectLegacy";

export default function EthSign({navigation, route}) {
  const {requestDetails} = route.params;
  const [request, setRequest] = useState({});
  const [domain, setDomain] = useState({});
  const [method, setMethod] = useState('');
  const [value, setValue] = useState({});
  const [walletAddress, setWalletAddress] = useState('');
  const [walletState, ] = useRecoilState(walletList);
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [page, setPage] = useState(0);
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
      setMethod(request['method']);
      if (request['method'] === EIP155_SIGNING_METHODS.ETH_SIGN) {
        setWalletAddress(request['params'][0]);
      }
      if (request['method'] === EIP155_SIGNING_METHODS.PERSONAL_SIGN) {
        setWalletAddress(request['params'][1]);
      }
      setValue(request['params']);
    }
    //console.log(request);
  }, [request])


  const approve = async () => {
    //const {result} = await approveEIP155Request(request, walletState);
    const result = await approveEIP155Request({
      id: request['id'],
      params: { chainId: '1', request: { method: request['method'], params: request['params'] } },
      topic: '',
    }, walletState);
    //console.log(result);
    legacySignClient.approveRequest({
      id: request['id'],
      result: result['result']
    })
    navigation.navigate('Home');
  }

  const reject = async () => {
    //const response = rejectEIP155Request(request)
    const { error } = rejectEIP155Request({
      id: request['id'],
      params: { chainId: '1', request: { method: request['method'], params: request['params'] } },
      topic: '',
    })
    legacySignClient.rejectRequest({
      error,
      id: request['id'],
    })
    navigation.navigate('Home');    
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
                <Heading size="md" mb={4}><Text>Signature Request</Text></Heading>              
              </Center>
              
                <Box m={2} p={2} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                  <ScrollView height={'50%'} width={'100%'} >
                    <Text>{JSON.stringify(value)}</Text>                    
                  </ScrollView>
                </Box>
              
              
            </VStack>
            <Button.Group isAttached colorScheme="blue" >
              <Button onPress={approve} variant={'solid'} rounded="none" size={'1/2'} my={6}><Text>{'Approve'}</Text></Button>
              <Button onPress={reject} variant={'outline'} rounded="none" size={'1/2'} my={6}><Text>{'Reject'}</Text></Button>
            </Button.Group>
          </Box>
        }        
      </Box>
    </GuestLayout>
  );
}