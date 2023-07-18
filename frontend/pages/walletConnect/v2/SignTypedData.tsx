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
import GuestLayout from "../../../layouts/GuestLayout";
import { approveEIP155Request, rejectEIP155Request } from "../../../service/eip1155Utils";
import { language as stateLanguage, walletList } from "../../../service/state";
import { truncateString } from "../../../service/utility";
import { signClient } from "../../../service/walletConnect";

export default function SignTypedData({navigation, route}) {
  const {requestDetails} = route.params;
  const [request, setRequest] = useState({});
  const [domain, setDomain] = useState({});
  const [types, setTypes] = useState({});
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
      setWalletAddress(request['params']['request']['params'][0]);
      const rawData = request['params']['request']['params'][1];
      const data = JSON.parse(rawData);
      //console.log(data);
      setDomain(data.domain);
      setTypes(data.types);
      setValue(data.message);
    }
  }, [request])


  const approve = async () => {
    const response = await approveEIP155Request(request, walletState);
    await signClient.respond({
      response,
      topic: request['topic'],
    })
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
        {request && request['params'] && value && value['contents'] && 
          <Box>
            <VStack height={'90%'}>
              <Center mt={5}>          
                <Heading size="md" mb={4}><Text>{translations[language].SignTyped.header}</Text></Heading>
                <Heading size="sm" mb={4}><Text>{translations[language].SignTyped.header_origin}{domain['name']}</Text></Heading>                
              </Center>
              
                <Box m={2} p={2} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                  <ScrollView height={'50%'} width={'100%'} >
                    <Text>{JSON.stringify(value)}</Text>                    
                  </ScrollView>
                </Box>
              
              
            </VStack>
            <Button.Group isAttached colorScheme="blue" >
              <Button onPress={approve} variant={'solid'} rounded="none" size={'1/2'} my={6}><Text>{translations[language].SignTyped.approve_button}</Text></Button>
              <Button onPress={reject} variant={'outline'} rounded="none" size={'1/2'} my={6}><Text>{translations[language].SignTyped.reject_button}</Text></Button>
            </Button.Group>
          </Box>
        }        
      </Box>
    </GuestLayout>
  );
}