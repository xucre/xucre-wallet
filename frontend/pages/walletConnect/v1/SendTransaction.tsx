import { MaterialIcons } from "@expo/vector-icons";
import { JsonRpcResponse, JsonRpcResult } from "@json-rpc-tools/utils";
import { BigNumber, ethers } from 'ethers';
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
import { truncateStringStart } from "../../../service/utility";
//import { signClient } from "../../../service/walletConnect";
import { legacySignClient } from "../../../service/walletConnectLegacy";

export default function SendTransaction({navigation, route}) {
  const {requestDetails} = route.params;
  const [request, setRequest] = useState({});
  const [to, setTo] = useState('');
  const [data, setData] = useState('');
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState(BigNumber.from(0));
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
      //console.log(request);
      setMethod(request['method']);
      setWalletAddress(request['params'][0]['from']);
      setTo(request['params'][0]['to']);
      setAmount(BigNumber.from(request['params'][0]['value']));
      setValue(request['params'][0]);
    }
  }, [request])


  const approve = async () => {
    const requestParams = request['params'][0];
    // eslint-disable-next-line functional/immutable-data
    delete requestParams['gas'];
    const result = await approveEIP155Request({
      id: request['id'],
      params: { chainId: '1', request: { method: request['method'], params: [requestParams] } },
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
                <Heading size="md" mb={4}><Text>Sign Transaction</Text></Heading>              
              </Center>
              
              <Box m={2} p={2} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                <ScrollView height={'50%'} width={'100%'} >
                  <Text>{JSON.stringify(value)}</Text>                    
                </ScrollView>
              </Box>
              <Box m={2} p={2}>
                <Text>From: {truncateStringStart(walletAddress, 25)}</Text>
                <Text>To: {truncateStringStart(to, 25)}</Text>
                <Text>Amount: {ethers.utils.parseEther(amount.toString()).toString()}</Text>
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